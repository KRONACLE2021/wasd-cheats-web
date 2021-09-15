import { Router, json } from 'express';
import CheckAuth from '../middleware/checkAuth';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

let Route = Router();

Route.use(json());

var s3 = new aws.S3({
    region: 'us-west',
    accessKeyId: "AKIA4CDI7M67XTH5LKRG",
    secretAccessKey: "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"
});

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'wasdusercontent',
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
})


Route.get("/usercontent", CheckAuth, upload.single('image'), (req, res, next) => {

    console.log(req.file);
    
    res.json({upload: "ok"});
});

export default Route;