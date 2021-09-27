import { Router, json, Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import CheckAuth from '../middleware/checkAuth';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import Attachments from '../models/Attachments';

let Route = Router();

Route.use(json());


var s3 = new aws.S3({
    endpoint: "nyc3.digitaloceanspaces.com",
    accessKeyId: "V6GERMXDHGD6PTQWZWKQ",
    secretAccessKey: "uiuzAXd3BMehHHeK8qCsf2cdNFBRGshBD+bhRj1Dghg"
});

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'wasd',
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        let id = uuid();
        cb(null, id)
      }
    })
})


Route.post("/usercontent", CheckAuth, upload.single('file'), async (req : Request, res: Response, next: NextFunction) => {

    let file : Express.MulterS3.File | undefined = req.file;

    if(!file) return res.json({ error: true, errors: ["Failed to upload"]}).status(500);

    let id = file.key;
    let name = file.originalname;
    let altText = "";
    let attachedTo = null;
    let url = file.location;
    let uid = res.locals.user.uid;

    let attachment_ = await new Attachments({ 
      id,
      name,
      altText,
      attachedTo,
      uid,
      url
    }).save();
    
    res.json({attachment_});
});

export default Route;