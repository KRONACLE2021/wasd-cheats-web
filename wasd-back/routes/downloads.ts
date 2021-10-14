import { Router, json, urlencoded } from 'express';
import { v4 as uuid } from 'uuid';
import CheckAuth from '../middleware/checkAuth';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import Downloads from '../models/Downloads';
import Subscription from '../models/Subscription';

let Route = Router();

var s3 = new aws.S3({
    endpoint: "nyc3.digitaloceanspaces.com",
    accessKeyId: "V6GERMXDHGD6PTQWZWKQ",
    secretAccessKey: "uiuzAXd3BMehHHeK8qCsf2cdNFBRGshBD+bhRj1Dghg"
});


Route.use(json());
Route.use(urlencoded({ extended: true }));
Route.use(CheckAuth);

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'wasd',
      acl: 'private',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        let id = uuid();
        cb(null, id)
      }
    }),
}).single('file');


Route.post("/upload", async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to access this endpoint"] }).status(403);
    
    let {
        id,
        version
    } = req.body;
    
    let upload_to = await Downloads.findOne({ id: id });

    if(!upload_to || upload_to == null) return res.json({ error: true, errors: ["Could not find a download to link this upload to!"]})

    if(!version || version == "") version = upload_to.version; 

    upload_to.version = version;

    upload(req, res, async (err) => {
        if(err){
            return res.json({ error: true, errors: ["Error uplaoding file to AWS"] });
        }

        let file = req.file;

        upload_to?.file_ids.push(file.key);

        await upload_to.save();

        return res.json({ done: true, download: upload_to });
    });
});

Route.post("/create", async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to access this endpoint"] }).status(403);
    
    let {
        name,
        description,
        linkedSubscripton
    } = req.body;

    if(!name) return res.json({ error: true, errors: ["Your download must have a name!"] });
    if(!description) return res.json({ error: true, errors: ["Your download must have a description!"] });
    if(!linkedSubscripton) return res.json({ error: true, errors: ["Your download must have a linked subscription!"] });

    const subscription_check = await Subscription.findOne({ id: linkedSubscripton });

    if(!subscription_check || subscription_check == null) return res.json({ error: true, errors: ["You need to select a valid subscription!"]});

    let id = uuid();

    let download = await new Downloads({
        id,
        name,
        description,
        linkedSubscripton,
        file_Ids: []
    }).save();

    return res.json({ done: true, download: download });
});

Route.get("/get/all", async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to access this endpoint"] }).status(403);
    
    let downloads = await Downloads.find({});
    
    return res.json({ done: true, downloads: downloads });
});

export default Route;