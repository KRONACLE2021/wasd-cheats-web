import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import Categorys from '../../models/Categorys';
import checkAuth from '../../middleware/checkAuth';
import Topics from '../../models/Topics';

let Route = Router();

Route.use(json());

Route.get("/all", async (req, res, next) => {
    
    let categorys_ = await Categorys.find();

    res.json({
        categorys: categorys_
    });
});


/* 
    GET /api/v1/categorys/:id/topics

    PERMISSIONS: None,
    Auth: none,

    Request params: 
    Id = category id

*/
Route.get('/:id/topics', async (req, res, next) => {
    let category = await Categorys.findOne({id: req.params.id});

    if(!category) return res.json({ error: true, errors: ["Could not find category!"] }).status(404);

    let topics = await Topics.find({ id: { $in: category.topics } });

    return res.json({
        category: category,
        topics: topics
    });

});


/* 
    POST /api/v1/topics/create

    PERMISSIONS: CREATE_POST
    Auth: API_TOKEN

    Body: {
        title: <category title>,
        description: <category description>,
    }
*/


Route.post("/create", checkAuth, async (req, res, next) => {

    console.log(res.locals.user.permissions);
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to make a category! Pepega Clap."]}).status(401);

    let body = req.body;

    let title = body.title;
    let description = body.description;

    let errors : Array<string> = [];

    if(!title) errors.push("You mush have a title for your category!");
    if(!description) errors.push("You mush have a description for your category!");

    if(errors.length !== 0) return res.json({ error: true, errors: errors });

    let id = uuid();

    let category = await Categorys.create({
        id,
        title,
        description,
        topics: []
    });

    return res.json({ category });
});


export default Route;