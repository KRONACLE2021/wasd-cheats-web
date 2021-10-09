import { Router, json } from 'express';
import { RedisClient } from 'redis';
import { v4 as uuid } from 'uuid';
import checkAuth from '../../middleware/checkAuth';
import Item from '../../models/Item';
import axios from 'axios';

let Route: Router = Router();

const PAYPAL_BASE = "https://api-m.sandbox.paypal.com/"
const PAYPAL_OAUTH_API = "v1/oauth2/token";
const PAYPAL_ORDER_API = "v2/checkout/orders";

const PAYPAL_CLIENT = "Afq0gJghMMDsCEPGnpFuI_WVXgU7CZxBfobBBUj5B5nAKKt330AmSglybiq9hpXZnQWo8qah0SOfglSA";
const PAYPAL_SECRET = "ELXcMlLV4KwTwpmzqPXfu1HZKCYJ1F2cyPLsEdvYrvSUwMF-iqTz2t_gH_B3YfgcC8cFOgI9fH9sDK5P";

const PAYPAL_API_AUTH = new Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`);

let PAYPAL_AUTH : Object | null = null;

Route.use(json());

const getPaypalOAuthKey = async () => {
    let pp_result = await axios.post(`${PAYPAL_BASE}${PAYPAL_OAUTH_API}`, "grant_type=client_credentials", {
        headers: {
            Authorization: `Basic ${PAYPAL_API_AUTH.toString('base64')}`,
            Accept: `application/json`
        }
    }).then(res => {
        if(res.data) {
            PAYPAL_AUTH = res.data;
            PAYPAL_AUTH.created_at = new Date();
            return res.data;
        } 
    }).catch(err => {
        console.log(err.response.data);
        return { error: true };
    });
}


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

Route.get("/order", checkAuth, async (req, res, next) => {
    let userId = res.locals.user.uid;

    const redis: RedisClient = req.app.get("redis");

    redis.get(`${userId}_order`, (err, res_) => {
        if(err || !res_) return res.json({ error: true, errors: ["User has not created an order yet! Please create one!"]});

        return res.json({ order: JSON.parse(res_) });
    });
});

Route.post("/payment/paypal", checkAuth, async (req, res, next) => {

    const redis: RedisClient = req.app.get("redis");

    if(!PAYPAL_AUTH){
        await getPaypalOAuthKey()
    }

    const userId = res.locals.user.uid;

    redis.get(`${userId}_order`, async (err, res_) => {
        if(err) return res.json({ error: true, errors: ["Could not get cart data from redis! "]});
        if(!res_) return res.json({ error: true, errors: ["Order not found! Did you forget to post your cart items?"]});

        let redisDataParsed = JSON.parse(res_);

        let order = await axios.post(`${PAYPAL_BASE}${PAYPAL_ORDER_API}`, {
            intent: "CAPTURE",
            purchase_units: redisDataParsed.items.map((i) => {
                return {
                    amount: {
                        currency_code: "USD",
                        value: i.price
                    }
                }
            })
        }, {
            headers: {
                Accpet: `application/json`,
                Authorization: `Bearer ${ PAYPAL_AUTH.access_token }`
            }
        }).then((order) => {
            if(order.data.id) {
                return res.json({ orderID: order.data.id }).status(200); 
            } else {
                return res.json(order.data.error).status(500);
            }

        }).catch((paypalApiError) => {
            return res.json({ error: paypalApiError.response.data }).status(500);
        });
    });

});


export default Route;