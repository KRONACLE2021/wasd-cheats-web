import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import Users from "../models/Users";
import Ban from '../models/Ban';
import checkAuth from '../middleware/checkAuth';
import Posts from '../models/Posts';
import sanitizeUsers from '../utils/sanitizeUsers';
import Attachments from '../models/Attachments';
import UserSubscription from "../models/UserSubscription";

let Route = Router();

Route.use(json());


Route.post("/admin/users/:id/update",  checkAuth, async (req, res, next) => {

    if(!res.locals.user.permissions.includes("MODERATOR") || !res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to execute this command!"]});

    let id = req.params.id;

    let {
        permissions,
        avatar,
        banner,
        banned
    } = req.body;

    let user = await Users.findOne({ uid: id });

    if(!user) return res.json({ error: true, errors: ["Could not find user!"]});W

    user.permissions = permissions ? permissions : user.permissions; 
    user.avatar = avatar ? avatar : user.avatar; 
    user.banner = banner ? banner : user.banner; 
    user.banned = banned ? banned : user.banned; 

    await user.save();

    return res.json({ done: true, user: user });
})

Route.get("/me", checkAuth, async (req, res, next) => {

    let user = res.locals.user;

    let dbUser = await Users.findOne({ id: user.uid });

    if(!dbUser) return res.json({ error: true, errors: ["We couldnt find your user? What? Impossible!"]});

    /* Validate user subscriptions */
    for(let i = 0; i < user.active_subscriptions.length; i++){
        
        let sub = user.active_subscriptions[i];

        let userSubscription = await UserSubscription.findOne({ id: sub });

        if(!userSubscription) continue;

        if(+(new Date()) > + userSubscription?.date_end){
            dbUser.active_subscriptions.splice(i, 1);
            userSubscription.is_active = false;
        }

        await userSubscription.save();
    };

    await dbUser.save();


    let cleanUser = {
        avatar: user.avatar, 
        email: user.email, 
        api_key: user.api_key, 
        username: user.username, 
        posts: user.posts, 
        created_at: user.created_at,
        permissions: user.permissions, 
        uid: user.uid, 
        tags: user.tags,
        banner: user.banner,
        active_subscriptions: dbUser.active_subscriptions
    };

    return res.json(cleanUser);
});

Route.post("/me/update", checkAuth, async (req, res, next) => {
    
    let {
        bio,
        banner,
        avatar
    } = req.body;

    let userId = res.locals.user.uid;

    let dbUser = await  Users.findOne({ uid: userId });

    if(!dbUser) return res.json({ error: true, errors: ["You dont exsist in our database! Wait how did we get here? This is impossible."]})

    //check if the images supplied are hosted on our site
    if(banner) {
        let attachment_check = await Attachments.findOne({ id: banner });
        if(!attachment_check) banner = "";
        dbUser.banner = attachment_check.id;
    } 
    if(avatar) {
        let attachment_check = await Attachments.findOne({ id: avatar });
        if(!attachment_check) avatar = "";
        dbUser.avatar = attachment_check.id;
    }

    dbUser.bio = bio ? bio : dbUser.bio;

    await dbUser.save();

    let sanitizedUser = sanitizeUsers(dbUser);

    return res.json({ done: true, user: sanitizedUser });
});

Route.get("/:id/posts", async (req, res, next) => {
    let id = req.params.id;

    let user = await Users.findOne({ uid: id });

    if(!user) return res.json({ error: true, errors: ["That user does not exsist!"] });

    let posts = await Posts.find({ uid: user.uid });

    return res.json({ posts: posts });
})

Route.get("/admin/users", checkAuth, async (req, res, next) => {
    let sortBy = req.query.sort;

    const sortByRecentUsers = async () => {
        let users = await Users.find({}).limit(10).sort({ created_at: 1 });

        let sanitizedUsers_ = sanitizeUsers(users);

        return sanitizedUsers_;
    }   

    const paginationUsers = async (limit: number, skip: number) => {
        let users = await Users.find({}).skip(skip).limit(limit);

        let sanitizedUsers_ = sanitizeUsers(users);

        return sanitizedUsers_;
    }

    switch(sortBy){
        case "RECENT":
            let users_ = await sortByRecentUsers()
            return res.json({ users: users_ });
        case "PAGINATION":
            let skip = parseInt(req.query.skip);
            let limit = parseInt(req.query.limit);

            if(isNaN(skip)) skip = 0;
            if(isNaN(limit)) limit = 10;

            let pagination_users = await paginationUsers(limit, skip);

            return res.json({ users: pagination_users });
        default: 
            return res.json({ error: true, errors: ["You must sort a user by a type! Accepted sortBy types: ['RECENT']"]});
    }

});

Route.post("/:id/ban", checkAuth, async (req, res, next) => {

    if(!res.locals.user.permissions.includes("MODERATOR") || !res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to execute this command!"]});

    let id = req.params.id;
    
    let bannedReason = req.body.reason || "No reason provided";

    let user_ = await Users.findOne({ uid: id });

    if(!user_) return res.json({ error: true, errors: ["This user does not exsist!"] });
    if(id == res.locals.user.uid) return res.json({ error: true, errors: ["Why are you trying to ban yourself? thats just odd."]});

    if(user_.banned == true) {
        user_.banned = false;

        await Ban.deleteOne({ id: user_.banId });
        
        user_.banId = null;
        
        await user_.save();

        res.json({
            done: true,
            message: "user has been unbanned!"
        });

    } else {
        user_.banned = true;
    
        let banId = uuid();
    
        user_.banId = banId;
        
        await user_.save();
    
        let userBan = await new Ban({
            id: banId,
            uid: user_.uid,
            bannedBy: res.locals.user.uid,
            banReason: bannedReason
        }).save();
    
        res.json({
            done: true,
            message: "user has been banned!",
            ban: userBan
        });
    
    }

});

Route.get("/:id", async (req, res, next) => {
    let { id } = req.params;

    let apiKey = req.headers.authorization;

    let isAdmin = false;
    let userCheck = await Users.findOne({ api_key: apiKey });

    if(userCheck) {
        if(userCheck.permissions.includes("MODERATOR") || userCheck.permissions.includes("ADMINISTRATOR")) {
            isAdmin = true;
        }
    }
    
    let user = await Users.findOne({ uid: id });
  
    if(!user) return res.json({ error: true, errors: ["User not found "]}).status(404);
    
    let cleanUser = {
        avatar: user.avatar, 
        username: user.username, 
        posts: user.posts, 
        permissions: user.permissions, 
        uid: user.uid, 
        tags: user.tags,
        banner: user.banner,
        banned: user.banned
    };

    let adminUser = {
        avatar: user.avatar, 
        username: user.username, 
        posts: user.posts, 
        permissions: user.permissions, 
        uid: user.uid, 
        tags: user.tags,
        banner: user.banner,
        last_logged_ip: user.last_logged_in_location,
        email: user.email,
        banned: user.banned,
        banId: user.banId,
        subscriptions: user.active_subscriptions
    }

    return res.json(isAdmin ? adminUser : cleanUser);
});


export default Route;