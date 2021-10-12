import { Router } from 'express';
import Reports from '../models/Report';

import CheckAuth from '../middleware/checkAuth';

const Route = Router();

Route.post("/post", CheckAuth, async (req, res, next) => {
    
    let {
        post_id,
        report_context
    } = req.body;

    if(!post_id) return res.json({ error: true, errors: ["Could not find post!"]});
    if(!report_context) report_context = "No further context was reported.";

    

});

export default Route;