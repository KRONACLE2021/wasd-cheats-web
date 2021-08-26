import { Request, Response, NextFunction } from "express";
import Users from '../models/Users';

export default async function CheckAuth(req : Request, res : Response, next : NextFunction) {
    let api_key = req.headers.authorization;
    if(!api_key) return res.json({ error: true, errors: ["Invalid API key!!"]}).status(401);
    
    let user = await Users.findOne({ api_key: api_key });
    if(!user) return res.json({ error: true, errors: ["Invalid API key"] }).status(401);
   
    res.locals.user = user;
    next();
}   