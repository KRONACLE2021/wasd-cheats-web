import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import Topics from '../../models/Topics';
import Categorys from '../../models/Categorys';
import checkAuth from '../../middleware/checkAuth';
import Threads from '../../models/Threads';
import Attachments from '../../models/Attachments';
import Posts from '../../models/Posts';

let Route = Router();

Route.use(json());


Route.post("/:id/lock", checkAuth, async (req, res, next) => {
    if(!res.locals.user.permissions.includes("MODERATOR")) return res.json({ error: true, errors: ["You do not have permissions to lock a topic!"]});

    let id = req.params.id;

    let topic = await Threads.findOne({ id: id });

    if(!topic) return res.json({ error: true, errors: ["Could not find topic!"]});

    topic.locked = true;
    await topic.save();
    
    return res.json({ topic: topic });
});

Route.get("/:id/threads", async (req, res, next) => {


    let queryLimit : string = req.query.limit as string;
    let querySkip : string = req.query.skip as string;

    let limit : any = parseInt(queryLimit);
    let skip : any = parseInt(querySkip);

    if(isNaN(limit)) limit = 20;
    if(isNaN(skip)) limit = 0;

    if(!limit) limit = 20;
    if(!skip) skip = 0;

    let topic_ = await Topics.findOne({ id: req.params.id });

    if(!topic_) return res.json({ error: true, errors: ["Topic not found!"]});


    let threads = await Threads.find({ id: { $in: topic_.threads } }).limit(limit).skip(skip);
    let threadAmount = await Threads.count({ id: { $in: topic_.threads } });

    return res.json({ threads: threads, total: threadAmount});
});

Route.get("/:id", async (req, res, next) => {
    let topics_ = await Topics.findOne({ id: req.params.id });

    if(!topics_) return res.json({ error: true, errors: ["Topic not found"]}).status(404);

    return res.json(topics_);
});

Route.post("/:id/delete", checkAuth, async (req, res, next) => {
    if(!res.locals.user.permissions.includes("MODERATOR")) return res.json({ error: true, errors: ["You do not have permissions to delete a topic!"]});

    let id = req.params.id;

    let Topic = await Topics.findOne({ id })

    if(!Topic) return res.json({ error: true, errors: ["This topic does not exsist!"]});

    let attachments = Topic.imgID;

    if(attachments) {
        let attachment_check = await Attachments.findOne({ id: attachments });

        if(attachment_check) {
            await Attachments.deleteOne({ id: attachments });
        }
    } 

    let threadsInTopic = await Threads.find({ topicId: id });

    for(var i of threadsInTopic){
        await Posts.deleteOne({ threadId: i.id });
    }

    await Threads.deleteMany({ topicId: id });
    
    await Topics.deleteOne({ id: id });

    return res.json({ done: true, message: "Topic has been deleted"});
});

/* 
    POST /api/v1/topics/create

    PERMISSIONS: CREATE_POST
    Auth: API_TOKEN

    Body: {
        title: <topic title>,
        description: <topic description>,
        category: <category id>,
        imgUrl: <uploaded image url for icon>
    }
*/

Route.post("/create", checkAuth, async (req, res, next) => {

    if(!res.locals.user.permissions.includes("MODERATOR")) return res.json({ error: true, errors: ["You do not have permissions to create a topic!"]});

    let body = req.body;

    let title = body.title;
    let description = body.description;
    let category = body.category;
    let attachmentId = body.attachmentId;

    let errors : Array<string> = [];

    let attachment = await Attachments.findOne({ id: attachmentId });

    if(!attachment) errors.push("That attachment id is invalid, please upload a image!");
    if(!title) errors.push("The topic you want to create must have a title!");
    if(!description) errors.push("The topic you want to create must have a description!");
    if(!category) errors.push("The topic you want to create must have a category id!");

    let Category = await Categorys.findOne({ id: category });

    if(!Category) errors.push("Category not found!");

    if(errors.length !== 0) return res.json({ error: true, errors });

    let id = uuid();

    let topic = await Topics.create({ id, description, category, imgID: attachment.id, threads: [], title });

    attachment.attachedTo = id;
    attachment?.save();

    Category?.topics.push(id);

    await Category?.save()

    return res.json(topic);
});

export default Route;