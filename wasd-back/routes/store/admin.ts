import { Router, json } from 'express';
import { RedisClient } from 'redis';
import { v4 as uuid } from 'uuid';
import checkAuth from '../../middleware/checkAuth';
import Attachments from '../../models/Attachments';
import Item from '../../models/Item';
import ItemSchema, { IStoreItem } from '../../models/Item';
import Subscription from '../../models/Subscription';

let Route = Router();

Route.use(json());

Route.get("/users/checkout/incart", checkAuth, async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to modify this content!"] }).status(403);

    const redis: RedisClient = req.app.get("redis");

    redis.get("*_order", (err, res_) => {

        if(err) return res.json({ error: true, errors: ["Could not get information from redis!"]}).status(500);

        if(!res_) return res.json({ in_cart: 0, orders: {} });

        return res.json({ in_cart: res_.length ? res_.length : 1, orders: res_})
    });
});

Route.post("/subscriptions/add", checkAuth, async (req, res, next) => {

    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to modify this content!"] }).status(403);

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

Route.post("/item/:id/delete", checkAuth, async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have premissions to modify this content!"]}).status(403);

    let id = req.params.id;

    let item = await Item.findOne({ id: id });

    if(!item) return res.json({ error: true, errors: ["Item not found"]});

    await Item.deleteOne({ id: id });
    
    return res.json({ 
        done: true, 
        item: item,
        messaage: "Item deleted successfully"
    });
})

Route.post("/item/:id/edit", checkAuth, async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have premissions to modify this content!"]}).status(403);

    let id = req.params.id;

    let {
        name,
        currency,
        description,
        price,
        stock,
        imgID,
        subscription
    } = req.body;

    let editingItem = await Item.findOne({ id: id });

    if(!editingItem) return res.json({ error: true, errors: ["The item you are trying to is not found!"]});

    if(subscription) {
        let subscription_check = await Subscription.findOne({ id: subscription });
        if(!subscription_check) subscription = null;
    }

    if(imgID){
        let attachemnt_check = await Attachments.findOne({ id: imgID });
        if(!attachemnt_check) imgID = null;
    }

    editingItem.name = name ? name : editingItem.name;
    editingItem.currency = currency ? currency : editingItem.currency;
    editingItem.description = description ? description : editingItem.description;
    editingItem.price = price ? price : editingItem.price;
    editingItem.stock = stock ? stock : editingItem.stock;
    editingItem.image = imgID ? imgID : editingItem.image;
    editingItem.subscription_id = subscription ? subscription : editingItem.subscription_id;

    await editingItem.save();

    return res.json({ item: editingItem, done: true });
});

Route.post("/item/add", checkAuth, async (req, res, next) => {

    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to modify this content!"] }).status(403);

    let {
        name,
        currency,
        description,
        price,
        stock,
        imgID,
        subscription
    } = req.body;

    let errors : Array<String> = [];

    if(!name) errors.push("You haven't provided a name for the item!");
    if(!currency) errors.push("You haven't provided a default currency for the item!");
    if(!description) errors.push("You haven't provided a description for the item!");
    if(!price) errors.push("You haven't provided a price for the item!");
    
    if(!stock) stock = 0;

 
    if(imgID){
        let attachment_check = await Attachments.findOne({ id: imgID });
        if(!attachment_check) imgID = null;
        console.log("added", imgID, "to the thingy");
    }

    let id = uuid();
    
    let Item = {
        name: name,
        currency: currency,
        description: description,
        price: price,
        stock: stock,
        id: id,
        image: imgID,
        subscription_id: subscription
    };

    let dbItem = await ItemSchema.create({
        name,
        currency,
        description,
        stock,
        price,
        id,
        image: imgID,
        subscription_id: subscription
    });

    return res.json({ item: Item });
});

export default Route;