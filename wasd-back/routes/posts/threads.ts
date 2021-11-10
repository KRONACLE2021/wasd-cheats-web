import {Router, json} from 'express';
import { v4 as uuid } from 'uuid';
import Threads from '../../models/Threads';
import checkAuth from '../../middleware/checkAuth';
import CreatePost from './functions/createPost';
import Topics from '../../models/Topics';
import Posts from '../../models/Posts';

let Route = Router();

Route.use(json());

Route.get('/:id/posts', async (req, res, next) => {
    

    let limit : number = parseInt(req.query.limit as string);
    let skip : number = parseInt(req.query.skip as string);


    if(isNaN(limit)) limit = 20;
    if(isNaN(skip)) limit = 0;

    if(!limit) limit = 20;
    if(!skip) skip = 0;


    let thread_ = await Threads.findOne({ id: req.params.id });

    if(!thread_) return res.json({ error: true, errors: ["Topic not found!"]});

    let posts = await Posts.find({ id: { $in: thread_.posts } }).limit(limit).skip(skip);

    return res.json(posts);
})

Route.get('/:id', async (req, res, next) => {
    
    let id = req.params.id;

    let thread = await Threads.findOne({ id: id });

    if(!thread) return res.json({ error: true, errors: ["Thread not found!"] });

    res.json(thread);
});

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


    let topic = await Topics.findOne({id: topicId});

    if(!topic) return res.json({ error: true, message: "That topic does not exsist!"})

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
        createdAt: new Date(), 
        id 
    });

    let createdPost = await CreatePost(post.attachments, post.contents, uid, id, "");

    topic.threads.push(id);
    await topic.save();

    if(createdPost == false) return res.json({ error: true, errors: ["Could not create inital post!"]});

    return res.json({
        title,
        topic_id: topicId,
        uid,
        id: id,
        created_at: thread.createdAt,
        locked: false,
        posts: [
            createdPost
        ]
    });

});

export default Route;