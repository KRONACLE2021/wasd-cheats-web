import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import checkAuth from '../../middleware/checkAuth';
import ItemSchema, { IStoreItem } from '../../models/Item';

let Route = Router();

Route.use(json());

Route.get("/item/add", checkAuth, async (req, res, next) => {

    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to modify this content!"] });

    let {
        name,
        currency,
        description,
        price,
        stock,
        imgUrl
    } = req.body;

    let errors : Array<String> = [];

    if(!name) errors.push("You haven't provided a name for the item!");
    if(!currency) errors.push("You haven't provided a default currency for the item!");
    if(!description) errors.push("You haven't provided a description for the item!");
    if(!price) errors.push("You haven't provided a price for the item!");
    
    if(!stock) stock = 0;
    
    let id = uuid();
    
    let Item = {
        name: name,
        currency: currency,
        description: description,
        price: price,
        stock: stock,
        id: id,
        image: imgUrl
    };

    let dbItem = await ItemSchema.create({
        name,
        currency,
        description,
        stock,
        price,
        id,
        image: imgUrl
    });

    return res.json(Item);
});

export default Route;