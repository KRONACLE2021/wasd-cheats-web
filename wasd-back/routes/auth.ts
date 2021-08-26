import { Router, json } from "express";
import UserModel from '../models/Users';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

let Route = Router();

Route.use(json);

Route.post("/register", async (req, res, next) => {

    let body = req.body;

    if(!body.username) return res.json({error: true, errors: ["No username provided!"]}).status(300);
    if(!body.password) return res.json({error: true, errors: ["No password provided!"]}).status(300);
    if(!body.email) return res.json({error: true, errors: ["No email provided!"]}).status(300);
    

    let usernameCheck = await UserModel.findOne({username: body.username});
    let emailCheck = await UserModel.findOne({email: body.email});

    if(usernameCheck) return res.json({error: true, errors: ["That username already exsists!"]}).status(300);
    if(emailCheck) return res.json({error: true, errors: ["An account with that email is already registered."]}).status(300);

    const generateRandomString = (length=6) => Math.random().toString(20).substr(2, length)

    bcrypt.hash(body.password, 10,  async (err, hash) => {
        
        if(err) return res.json({error: true, errors: ["There was a problem trying to hash the password!"]}).status(500);

        let user = {
            uid: uuid(),
            tags: [],
            permissions: ["REGULAR"],
            avatar: "",
            email: body.email,
            api_key: generateRandomString(16),
            posts: [],
            username: body.username,
            passowrd: hash
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


Route.get("/login", async (req, res, next) => {
    let body = req.body;

    if(!body.username) return res.json({error: true, errors: ["No email/username provided!"]});
    if(!body.password) return res.json({error: true, errors: ["No password provided!"]});


    let user = await UserModel.findOne({ username: body.username }, { email: body.email });

    if(!user) return res.json({error: true, errors: ["User does not exsist!"]});
     
    let pwdCheck = bcrypt.compareSync(body.username, user.password);

    if(!pwdCheck) return res.json({error: true, errors: ["Password is incorrect!"]});

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


export default Router;