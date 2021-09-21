import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import PostsModel from '../../models/Posts';
import CreatePost from './functions/createPost';
import Threads from '../../models/Threads';
import checkAuth from '../../middleware/checkAuth';
import { IUser } from '../../models/Users';
import Posts from '../../models/Posts';

let Route = Router();

Route.use(json());


Route.get("/get/:postId", async (req, res, next) => {
    
    let postid = req.params.postId;

    let post = await PostsModel.findOne({ id: postid });

    if(!post) return res.json({message: "Post not found!"}).status(404);
 
    return res.json(post);
});

Route.delete("/delete/:id", checkAuth, async (req, res, next) => {

    let postId = req.params.id;
    const post_ = await Posts.findOne({ id: postId });

    if(!post_) return res.json({ error: true, errors: ["That post does not exsist!"] }).status(404);

    if(post_.uid !== res.locals.user.uid && !res.locals.user.permissions.includes("MODERATOR")) return res.json({ error: true, errors: ["You do not have permission to modify this content!"] });

    await Posts.deleteOne({ id: postId });

    return res.json({ done: true, message: "Post has been deleted." });
});

Route.post("/create", checkAuth, async (req, res, next) => {

    let body = req.body;
    let errors : Array<string> = [];

    let user : IUser = res.locals.user; 

    if(!user.permissions.includes("ALLOW_POSTING") && !user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You're not allowed to post!"] }); 

    let attachments = body.attachments;
    let refrenced_post_id = body.refrenced_thread;
    let contents = body.contents;
    let id = uuid();
    let threadId = body.thread_id;


    //provide attachment checking

    
    //check for blank posts and "spam"
    if(!contents || contents == "" || contents.replace(/\s/g, '').length == 0) errors.push("You must provide the contents of what you want to post!");
    if(!threadId) errors.push("There must be a thread to attach this post too!! What are you some sort of maniac who dosent use threads, come on now come get this man.")

    /* Find Thread */
    let thread = await Threads.findOne({ id: threadId });

    if(!thread) return res.json({ error: true, errors: "There is no thread to go along with this post."});
    if(errors.length !== 0) return res.json({error: true, errors});
    

    /* check if we're refrencing another thread basically checking if were replying to someone else */
    if(refrenced_post_id !== "") {
        let refrenced_post = await Posts.find({ id: refrenced_post_id });

        if(refrenced_post.threadID !== thread.id) refrenced_post_id = null;

        if(!refrenced_post) refrenced_post_id = null; 
    } 


    let post = await CreatePost(attachments, contents, user.uid, threadId, refrenced_post_id);

    if(post == false) return res.json({ error: true, errors: ["Could not save post to database! If this error continues please contact a website admin. "]});

    return res.json(post);
});

export default Route;