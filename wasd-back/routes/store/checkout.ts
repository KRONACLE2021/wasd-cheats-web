import { Router } from 'express';
import { RedisClient } from 'redis';
import { v4 as uuid } from 'uuid';
import checkAuth from '../../middleware/checkAuth';
import Item from '../../models/Item';

let Route: Router = Router();

Route.post("/create-order", checkAuth, async (req, res, next) => {
    let userId = res.locals.user.uid;

    let items = req.body.items;
    let validatedItems = [];

    const redis : RedisClient = req.app.get("redis");

    if(!items) return res.json({ error: true, errors: ["You cannot create an order with no items in it!"] });

    if(!items.length) return res.json({ error: true, errors: ["Items should be an array!"]});

    for(var i in items){
        let item = await Item.findOne({ id: items[i] });

        if(item) {
            validatedItems.push(item);
        }
    } 

    let order = {
        items: validatedItems,
        uid: userId
    }

    redis.set(`${userId}_order`, JSON.stringify(order));

    return res.json(order);
});

Route.post("/order", checkAuth, async (req, res, next) => {
    let userId = res.locals.user.uid;

    const redis: RedisClient = req.app.get("redis");

    redis.get(`${userId}_order`, (err, res_) => {
        if(err || !res_) return res.json({ error: true, errors: ["User has not created an order yet! Please create one!"]});

        return res.json({ order: JSON.parse(res_) });
    });
});

Route.post("/payment/paypal", checkAuth, (req, res, next) => {

});


export default Route;