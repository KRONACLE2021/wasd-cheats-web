import { Router, json } from 'express';
import Users from "../models/Users";
import checkAuth from '../middleware/checkAuth';

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
        permissions: user.permissions, 
        uid: user.uid, 
        tags: user.tags 
    };

    return res.json(cleanUser);
});

export default Route;