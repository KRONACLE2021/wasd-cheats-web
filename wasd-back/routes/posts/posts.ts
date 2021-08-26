import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import PostsModel from '../../models/Posts';
import CreatePost from './functions/createPost';
import Threads from '../../models/Threads';
import { IUser } from '../../models/Users';

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
    let errors : Array<string> = [];

    let user : IUser = res.locals.user;

    if(!user.permissions.includes("ALLOW_POSTING") && !user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You're not allowed to post!"] }); 

    let attachments = body.attachments;
    let contents = body.contents;
    let id = uuid();
    let threadId = body.thread_id;

    //provide attachment checking

    if(!contents) errors.push("You must provide the contents of what you want to post!");
    if(!threadId) errors.push("There must be a thread to attach this post too!! What are you some sort of maniac who dosent use threads, come on now come get this man.")

    let thread = await Threads.findOne({ id: threadId });

    if(!thread) return res.json({ error: true, errors: "There is no thread to go along with this post."});
    if(errors.length !== 0) return res.json({error: true, errors});

    let post = await CreatePost(attachments, contents, user.uid, threadId)

    if(post == false) return res.json({ error: true, errors: ["Could not save post to database! If this error continues please contact a website admin. "]});

    thread.posts.push(id);
    await thread.save(); 

    return res.json(post);
});

export default Route;