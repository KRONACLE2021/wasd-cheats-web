import { Router, json } from 'express';
import CheckAuth from '../middleware/checkAuth';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

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
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
})


Route.post("/usercontent", CheckAuth, upload.single('file'), (req, res, next) => {

    console.log(req.file);
    
    res.json({upload: "ok"});
});

export default Route;