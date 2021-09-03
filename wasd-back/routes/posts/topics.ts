import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import Topics from '../../models/Topics';
import Categorys from '../../models/Categorys';
import checkAuth from '../../middleware/checkAuth';

let Route = Router();

Route.use(json());

Route.get("/:id", async (req, res, next) => {
    let topics_ = await Topics.findOne({ id: req.params.id });

    if(!topics_) return res.json({ error: true, errors: ["Topic not found"]}).status(404);

    return res.json(topics_);
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
    let imgUrl = body.imgUrl;

    let errors : Array<string> = [];

    if(!title) errors.push("The topic you want to create must have a title!");
    if(!description) errors.push("The topic you want to create must have a description!");
    if(!category) errors.push("The topic you want to create must have a category id!");
    if(!imgUrl) errors.push("The topic you want to create must have a image!");

    let Category = await Categorys.findOne({ id: category });

    if(!Category) errors.push("Category not found!");

    if(errors.length !== 0) return res.json({ error: true, errors });

    let id = uuid();

    let topic = await Topics.create({ id, description, category, imgUrl, threads: [], title });

    Category?.topics.push(id);

    await Category?.save()

    return res.json(topic);
});


export default Route;