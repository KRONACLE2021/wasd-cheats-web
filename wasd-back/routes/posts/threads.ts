import {Router, json} from 'express';
import { v4 as uuid } from 'uuid';
import Threads from '../../models/Threads';
import checkAuth from '../../middleware/checkAuth';
import CreatePost from './functions/createPost';

let Route = Router();

Route.use(json());


/* 
    POST /api/v1/threads/create

    PERMISSIONS: ALLOW_POSTING
    Auth: API_TOKEN

    Body: {
        title: "thread title",
        topicId: <id of topic to fall under>,
        post: {
            contents: <contents of post>
        }
    }
*/
Route.post("/create", checkAuth, async (req, res, next) => {

    let body = req.body;
    let user = res.locals.user;

    let errors : Array<String> = [];

    let title = body.title;
    let topicId = body.topic_id;
    let post = body.post;
    let uid = user.uid;
    let id = uuid();


    if(!user.permissions.includes("ALLOW_POSTING")) return res.json({error: true, message: "You're not allowed to post things!"});

    if(!title) errors.push("Your thread must have a title!");
    
    if(!post) errors.push("Your thread must have an init post!");
    if(!post.contents) errors.push("Your post must contain something!");

    if(errors.length !== 0) return res.json({ error: true, errors });

    let thread = await Threads.create({ title, 
        topicId, 
        locked: false, 
        posts: [], 
        uid, 
        id 
    });

    let createdPost = await CreatePost(post.attachments, post.contents, uid, id);

    if(createdPost == false) return res.json({ error: true, errors: ["Could not create inital post!"]});

    return res.json({
        title,
        topic_id: topicId,
        uid,
        created_at: thread.createdAt,
        locked: false,
        posts: [
            createdPost
        ]
    });

});

export default Route;