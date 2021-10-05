import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import Users from "../models/Users";
import Ban from '../models/Ban';
import checkAuth from '../middleware/checkAuth';
import Posts from '../models/Posts';
import sanitizeUsers from '../utils/sanitizeUsers';

let Route = Router();

Route.use(json());

Route.get("/me", checkAuth, (req, res, next) => {

    let user = res.locals.user;

    let cleanUser = {
        avatar: user.avatar, 
        email: user.email, 
        api_key: user.api_key, 
        username: user.username, 
        posts: user.posts, 
        created_at: user.created_at,
        permissions: user.permissions, 
        uid: user.uid, 
        tags: user.tags 
    };

    return res.json(cleanUser);
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

    switch(sortBy){
        case "RECENT":
            let users_ = await sortByRecentUsers()
            return res.json({ users: users_ });
        default: 
            return res.json({ error: true, errors: ["You must sort a user by a type! Accepted sortBy types: ['RECENT']"]});
    }

});

Route.post("/:id/ban", checkAuth, async (req, res, next) => {

    if(!res.locals.user.permissions("MODERATOR") || !res.locals.user.permissions("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to execute this command!"]});

    let id = req.params.id;
    
    let bannedReason = req.body.reason || "No reason provided";

    let user_ = await Users.findOne({ uid: id });

    if(!user_) return res.json({ error: true, errors: ["This user does not exsist!"] });

    user_.banned = true;

    let banId = uuid();

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

});

Route.get("/:id", async (req, res, next) => {
    let { id } = req.params;
    
    let user = await Users.findOne({ uid: id });
  
    if(!user) return res.json({ error: true, errors: ["User not found "]}).status(404);
    
    let cleanUser = {
        avatar: user.avatar, 
        username: user.username, 
        posts: user.posts, 
        permissions: user.permissions, 
        uid: user.uid, 
        tags: user.tags 
    };

    return res.json(cleanUser);
});


export default Route;