import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import Categorys from '../../models/Topics';
import checkAuth from '../../middleware/checkAuth';

let Route = Router();

Route.use(json);


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
    
    if(res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to make a category! Pepega Clap."]}).status(401);

    let body = req.body;

    let title = body.title;
    let description = body.description;

    let errors : Array<string> = [];

    if(!title) errors.push("You mush have a title for your category!");
    if(!description) errors.push("You mush have a description for your category!");

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