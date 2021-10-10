import { Router } from 'express';
import aws from 'aws-sdk';
import { GetObjectRequest } from 'aws-sdk/clients/s3';

let Route = Router();

var s3 = new aws.S3({
    endpoint: "nyc3.digitaloceanspaces.com",
    accessKeyId: "V6GERMXDHGD6PTQWZWKQ",
    secretAccessKey: "uiuzAXd3BMehHHeK8qCsf2cdNFBRGshBD+bhRj1Dghg"
});

Route.get("/file/:id", (req, res, next) => {
    
    let id = req.params.id;

    let params : GetObjectRequest = {
        Bucket: 'wasd',
        Key: id
    };

    s3.getObject(params, (err, data) => {
        if(err) return res.json({ error: true, errors: ["Error returned from AWS S3 "]});
        
        res.header("Content-Type", data.ContentType).send(data.Body);
    })
});

export default Route;