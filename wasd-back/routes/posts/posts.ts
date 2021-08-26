import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import TopicsRoute from './topics';
import PostsModel from '../../models/Posts';

let Route = Router();

Route.use(json);

Route.get("/get/:postId", async (req, res, next) => {
    
    let postid = req.params.postId;

    let post = await PostsModel.findOne({ id: postid });

    if(!post) return res.json({message: "Post not found!"}).status(404);

    return res.json(post);
});

Route.post("/create", async (req, res, next) => {

    let body = req.body;
    
    let user = res.locals.user;

    let title = body.title;
    let contents = body.contents;
    let id = uuid();
    let threadId = body.thread_id;




});

export default Route;