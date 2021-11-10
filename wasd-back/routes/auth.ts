import { Router, json } from "express";
import UserModel from '../models/Users';
import { isEmailBurner } from "burner-email-providers";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import DiscordOauth from './discord_oauth';
import HCaptchaVerify from "../utils/hCaptcha";
import UserSubscription from "../models/UserSubscription";


let Route = Router();


Route.use(json());


Route.use("/discord", DiscordOauth);

Route.post("/register", async (req, res, next) => {

    let body = req.body;

    if(!body.username) return res.json({error: true, errors: ["No username provided!"]}).status(300);
    if(!body.password) return res.json({error: true, errors: ["No password provided!"]}).status(300);
    if(!body.email) return res.json({error: true, errors: ["No email provided!"]}).status(300);
    if(!body.h_captcha) return res.json({ error: true, errors: ["No h-captcha token provided!"] });

    await HCaptchaVerify(body.h_captcha).then((res_ : { success: boolean }) => {
        if(!res_.success){
            return res.json({ error: true, errors: ["Please retry the captcha!"]})
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ error: true, errors: ["Internal server error occured whilst trying to contact HCAPTCHA, try again later."]});
    });

    
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isEmail = re.test(String(body.email).toLowerCase());

    if(!isEmail) return res.json({error: true, errors: ["The email you provided is invalid!"]});

    let isBurner = isEmailBurner(body.email);

    if(isBurner) return res.json({error: true, errors: ["The email you provided is considered a burner or invalid."]});

    let usernameCheck = await UserModel.findOne({username: body.username});
    let emailCheck = await UserModel.findOne({email: body.email});

    if(usernameCheck) return res.json({error: true, errors: ["That username already exsists!"]}).status(300);
    if(emailCheck) return res.json({error: true, errors: ["An account with that email is already registered."]}).status(300);

    
    if(/[!/\\=+<> ]/.test(body.username)) return res.json({ error: true, errors: ["This username contains invalid characters such as '!/\\=+<>'"]}) 

    const generateRandomString = (length=6) => Math.random().toString(20).substr(2, length)

    bcrypt.hash(body.password, 10,  async (err, hash) => {
        
        if(err) return res.json({error: true, errors: ["There was a problem trying to hash the password!"]}).status(500);

        let user = {
            uid: uuid(),
            tags: [],
            permissions: ["REGULAR", "ALLOW_POSTING"],
            avatar: "",
            email: body.email,
            api_key: generateRandomString(64),
            posts: [],
            username: body.username,
            password: hash
        }

        await UserModel.create(user);

        res.json({ avatar: user.avatar, 
            email: user.email, 
            api_key: user.api_key, 
            username: user.username, 
            posts: user.posts, 
            permissions: user.permissions, 
            uid: user.uid, 
            tags: user.tags 
        });
    });
  
});


Route.post("/login", async (req, res, next) => {
    let body = req.body;

    if(!body.username) return res.json({error: true, errors: ["No email/username provided!"]});
    if(!body.password) return res.json({error: true, errors: ["No password provided!"]});
    if(!body.h_captcha) return res.json({ error: true, errors: ["No h-captcha token provided!"] });

    await HCaptchaVerify(body.h_captcha).then((res_) => {
        if(!res_.success){
            return res.json({ error: true, errors: ["Please retry the captcha!"]})
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ error: true, errors: ["Internal server error occured whilst trying to contact HCAPTCHA, try again later."]});
    });

    let user = await UserModel.findOne({ username: body.username });

    if(!user) {
        user = await UserModel.findOne({ email: body.email });
    }

    if(!user) return res.json({error: true, errors: ["User does not exsist!"]});
     
    let pwdCheck = bcrypt.compareSync(body.password, user.password);

    if(!pwdCheck) return res.json({error: true, errors: ["Password is incorrect!"]});

    if(user.banned == true) return res.json({ error: true, errors: ["You have been banned from WASD."] }) 

    let userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress; 

    if(!user.permissions.includes("PROTECTED_USER")){
        if(typeof userIP == "string"){
            user.last_logged_in_location = userIP ? userIP : "";
            await user.save();
        }
    }


    /* Validate user subscriptions */
    for(let i = 0; i < user.active_subscriptions.length; i++){
        
        let sub = user.active_subscriptions[i];

        let userSubscription = await UserSubscription.findOne({ id: sub });

        if(!userSubscription) continue;

        if(+(new Date()) > + userSubscription?.date_end){
            user.active_subscriptions.splice(i, 1);
            userSubscription.is_active = false;
        }

        await userSubscription.save();
    };



    let cleanUser = {
        avatar: user.avatar, 
        email: user.email, 
        api_key: user.api_key, 
        username: user.username, 
        posts: user.posts, 
        permissions: user.permissions, 
        uid: user.uid, 
        tags: user.tags 
    }

    return res.json(cleanUser);
});


export default Route;