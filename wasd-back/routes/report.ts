import { Router, json } from 'express';
import { v4 as uuid } from 'uuid';
import Reports from '../models/Report';
import HCaptchaVerify from '../utils/hCaptcha';
import CheckAuth from '../middleware/checkAuth';

const Route = Router();

Route.use(json());


Route.post("/post", CheckAuth, async (req, res, next) => {
    
    let {
        content_id,
        report_context,
        h_captcha
    } = req.body;

    let post_id = content_id;

    if(!post_id) return res.json({ error: true, errors: ["Could not find post!"]});
    if(!report_context) report_context = "No further context was reported.";
    if(!h_captcha) return res.json({ error: true, errors: ["Please complete the captcha!"]});

    await HCaptchaVerify(h_captcha).then((res_: any) => {
        if(!res_.success){
            return res.json({ error: true, errors: ["Please retry the captcha!"]})
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ error: true, errors: ["Internal server error occured whilst trying to contact HCAPTCHA, try again later."]});
    });

    let id = uuid();
    let uid = res.locals.user.uid;

    let report = await new Reports({
        content_id: post_id,
        content_type: "POST",
        id: id,
        resolved: false,
        report_context: report_context,
        uid: uid
    }).save();

    let sanitized_report = {
        content_id: post_id,
        content_type: "POST",
        id: id,
        resolved: false,
        report_context: report_context, 
        uid: uid
    }

    return res.json({ 
        done: true, 
        message: "Report submitted", 
        report: sanitized_report
    });
});

export default Route;