import { Router } from 'express';
import Item from '../../models/Item';

let Route = Router();

Route.get("/", async (req, res, next) => {
    
    let items = await Item.find({});

    return res.json({items});
});

export default Route;