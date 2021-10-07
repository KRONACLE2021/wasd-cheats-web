import { Router } from 'express';
import Item from '../../models/Item';

let Route = Router();

Route.get("/:id", async (req, res, next) => {
    let itemId = req.params.id;

    let item = await Item.findOne({ id: itemId });

    if(!item) return res.json({ error: true, errors: ["Could not find the item that you are looking for!"] });

    res.json({ item });

});

Route.get("/", async (req, res, next) => {
    
    let items = await Item.find({});

    return res.json({items});
});

export default Route;