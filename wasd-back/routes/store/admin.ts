import { Router, json } from 'express';
import { RedisClient } from 'redis';
import { v4 as uuid } from 'uuid';
import checkAuth from '../../middleware/checkAuth';
import ItemSchema, { IStoreItem } from '../../models/Item';

let Route = Router();

Route.use(json());

Route.get("/users/checkout/incart", checkAuth, async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to modify this content!"] });

    const redis: RedisClient = req.app.get("redis");

    redis.get("*_order", (err, res_) => {

        if(err) return res.json({ error: true, errors: ["Could not get information from redis!"]}).status(500);

        if(!res_) return res.json({ in_cart: 0, orders: {} });

        return res.json({ in_cart: res_.length ? res_.length : 1, orders: res_})
    });
});

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