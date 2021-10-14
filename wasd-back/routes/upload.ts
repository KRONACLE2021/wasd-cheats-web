import { Router, json, Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import CheckAuth from '../middleware/checkAuth';
import multer, { MulterError } from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import Attachments, { IAttachment } from '../models/Attachments';

let Route = Router();

Route.use(json());


var s3 = new aws.S3({
    endpoint: "nyc3.digitaloceanspaces.com",
    accessKeyId: "V6GERMXDHGD6PTQWZWKQ",
    secretAccessKey: "uiuzAXd3BMehHHeK8qCsf2cdNFBRGshBD+bhRj1Dghg"
});


const ALLOWED_UPLOAD_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/gif': 'gif'
}


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
    }),
    limits: { fileSize: 2e+7 },
    fileFilter: (req, file, cb) => {
      let isValid = false;
      
      if(ALLOWED_UPLOAD_TYPES[file.mimetype]) isValid = true;

      let error = isValid ? null : new Error("Invlid mime type!!");
      cb(error, isValid);
    }
})

Route.post("/admin/upload", CheckAuth, (req, res, next) => {
  
  //just make sure that we dont upload the files
  if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to access this endpoint"] }).status(403);
  next();

}, upload.array('files', 10), async (req : Request, res: Response, next: NextFunction) => {

  let files : Express.MulterS3.File[] | undefined = req.files;

  if(!files) return res.json({ error: true, errors: ["Failed to upload files."]}).status(500);

  let finialziedAttachments : Array<IAttachment> = [];

  for(var i of files){
    let id = i.key;
    let name = i.originalname;
    let altText = "";
    let url = i.location;
    let uid = res.locals.user.uid;

    let attachmnet_= await new Attachments({
      id,
      name,
      altText,
      attachedTo: null,
      uid,
      url
    }).save();

    finialziedAttachments.push(attachmnet_);
  }

  return res.json({ done: true, files: finialziedAttachments });
});


Route.post("/usercontent", CheckAuth, upload.single('file'), async (req : Request, res: Response, next: NextFunction) => {

    let file : Express.MulterS3.File | undefined = req.file;

    if(!file) return res.json({ error: true, errors: ["Failed to upload"]}).status(500);

    let id = file.key;
    let name = file.originalname;
    let altText = "";
    let attachedTo = null;
    let url = file.location;
    let uid = res.locals.user.uid;
    let size = file.size;

    let attachment_ = await new Attachments({ 
      id,
      name,
      altText,
      attachedTo,
      uid,
      url,
      size
    }).save();
    
    res.json({attachment_});
});

export default Route;