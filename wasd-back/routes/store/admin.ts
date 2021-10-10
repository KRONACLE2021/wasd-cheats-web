import { Router, json } from 'express';
import { RedisClient } from 'redis';
import { v4 as uuid } from 'uuid';
import checkAuth from '../../middleware/checkAuth';
import ItemSchema, { IStoreItem } from '../../models/Item';
import Subscription from '../../models/Subscription';

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

Route.post("/subscriptions/add", checkAuth, async (req, res, next) => {

    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to modify this content!"] });

    let {
        name,
        time_span,
    } = req.body;

    if(!name || name == "") return res.json({ error: true, errors: ["A subscription must have a name!"]});
    if(!time_span || isNaN(parseInt(time_span))) return res.json({ error: true, errors: ["A subscription must have a time span! And the time span must be represented in miliseconds"]});

    let time_span_int = parseInt(time_span); 

    let id = uuid();

    let subscription = await new Subscription({
        name: name,
        time_span: time_span_int,
        id: id
    }).save();

    return res.json({ done: true, subscription: subscription });
});

Route.get("/subscriptions/get", checkAuth, async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to view this content!"] }).status(403);

    let subscriptions = await Subscription.find({});

    return res.json({ done: true, subscriptions });
});

Route.post("/subscription/:id/delete", checkAuth, async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to modify this content!"] }).status(403);

    let id = req.params.id;

    let subscription = await Subscription.findOne({ id: id });

    if(!subscription) return res.json({ error: true, errors: ["That subscription does not exsist!"]});

    await Subscription.deleteOne({ id });

    return res.json({ doen: true, message: "Subscription has been deleted!"});
});

Route.post("/item/add", checkAuth, async (req, res, next) => {

    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to modify this content!"] });

    let {
        name,
        currency,
        description,
        price,
        stock,
        imgUrl,
        subscription
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
        image: imgUrl,
        subscription_id: subscription
    };

    let dbItem = await ItemSchema.create({
        name,
        currency,
        description,
        stock,
        price,
        id,
        image: imgUrl,
        subscription_id: subscription
    });

    return res.json({ item: Item });
});

export default Route;