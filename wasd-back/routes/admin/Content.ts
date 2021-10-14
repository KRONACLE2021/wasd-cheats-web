import { Router, json } from 'express';
import CheckAuth from '../../middleware/checkAuth';
import aws from 'aws-sdk';
import Attachments from '../../models/Attachments';
import { GetObjectRequest } from 'aws-sdk/clients/s3';

const s3 = new aws.S3({
    endpoint: "nyc3.digitaloceanspaces.com",
    accessKeyId: "V6GERMXDHGD6PTQWZWKQ",
    secretAccessKey: "uiuzAXd3BMehHHeK8qCsf2cdNFBRGshBD+bhRj1Dghg"
});

const Route = Router();

Route.use(json());
Route.use(CheckAuth);

Route.use((req, res, next) => {
    if(!res.locals.user.permissions.includes("MODERATOR") || !res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, message: ["whatchu doin poking around these parts of the api??? ur not supposed to be here chump."]}).status(403);
    next();
})


Route.post("/files/:id/delete", async (req, res, next) => {
    let id = req.params.id;

    let attachment = await Attachments.findOne({ id: id });

    if(!attachment) return res.json({ error: true, errors: ["Cant delete a file that dosent exsist!"]});

    try {
        await s3.deleteObject({
            Bucket: "wasd",
            Key: id
        }).promise();
    } catch(e) {
        return res.json({
            error: true,
            errors: ["Could not delete object from s3!"]
        });
    }

    await Attachments.deleteOne({ id: id });

    return res.json({ done: true, message: "File has been deleted!" });
});

Route.get("/images", async (req, res, next) => {
    
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);

    if(isNaN(limit)) limit = 30;
    if(isNaN(skip)) skip = 0;

    let attachments_ = await Attachments.find({}).skip(skip).limit(limit);

    res.json({ done: true, content: attachments_ });
});

export default Route;