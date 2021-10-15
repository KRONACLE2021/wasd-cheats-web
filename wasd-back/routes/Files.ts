import { Router } from 'express';
import aws from 'aws-sdk';
import { GetObjectRequest } from 'aws-sdk/clients/s3';
import { RedisClient } from 'redis';  

let Route = Router();

var s3 = new aws.S3({
    endpoint: "nyc3.digitaloceanspaces.com",
    accessKeyId: "V6GERMXDHGD6PTQWZWKQ",
    secretAccessKey: "uiuzAXd3BMehHHeK8qCsf2cdNFBRGshBD+bhRj1Dghg"
});

Route.get("/protected/:id", async (req, res, next) => { 
    let id = req.params.id;

    const reids: RedisClient = req.app.get("redis");

    reids.get(id, (err, data) => {
        if(err || !data) return res.json({ error: true, errors: ["Could not find download link! Are you sure this isn't an expired link?"]});

        let parsedData = JSON.parse(data);
    
        if(!parsedData) return res.json({ error: true, errors: ["Could not parse data from redis!"]});
        if(!parsedData.file_id) return res.json({ error: true, errors: ["Could not find file_id, are you sure this is a correctly formatted download link?"]});
        
        if(parsedData.date < Date.now())  {

            reids.del(id);

            return res.json({ error: true, errors: ["Downlaod link has expired!"]})
        }

        let params : GetObjectRequest = {
            Bucket: 'wasd',
            Key: parsedData.file_id
        };
    
        s3.getObject(params, (err, data) => {
            if(err) return res.json({ error: true, errors: ["Error returned from AWS S3 "]});
            
            reids.del(id);

            res.header("Content-Type", data.ContentType).send(data.Body);
        })
        
    });
})

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