import { Router, json, urlencoded } from 'express';
import { v4 as uuid } from 'uuid';
import CheckAuth from '../middleware/checkAuth';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import Downloads from '../models/Downloads';
import Subscription from '../models/Subscription';
import { RedisClient } from 'redis';
import path from 'path';
import UserSubscription from '../models/UserSubscription';
import Users from '../models/Users';

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
        let id = uuid() + path.extname(file.originalname);
        cb(null, id)
      }
    }),
}).single('file');


Route.get("/user/all", async (req, res, next) => {

    let user = await Users.findOne({ uid: res.locals.user.uid });

    for await (var i in user.active_subscriptions) {
        
        let sub = user.active_subscriptions[i];

        let userSubscription = await UserSubscription.findOne({ id: sub });

        if(!userSubscription) continue;

        if(+(new Date()) > +userSubscription?.date_end){
            user.active_subscriptions.splice(i, 1);
            userSubscription.is_active = false;
        }

        await userSubscription.save();
    };

    await user.save();

    let activeDownloads = [];

    for await (var i in user?.active_subscriptions) {

        let sub = user.active_subscriptions[i];
        let userSubscription = await UserSubscription.findOne({ id: sub });

        let download_check = await Downloads.findOne({ linkedSubscription: userSubscription.plan_id });

        if(download_check){
            activeDownloads.push(download_check);
        }

    }

    return res.json({ done: true, downloads: activeDownloads});

});

Route.post("/upload", async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to access this endpoint"] }).status(403);


    upload(req, res, async (err) => {
        if(err){
            return res.json({ error: true, errors: ["Error uplaoding file to AWS"] });
        }

        let {
            id,
            version,
            notes
        } = req.body;
        
        let upload_to = await Downloads.findOne({ id: id });
    
        if(!upload_to || upload_to == null) return res.json({ error: true, errors: ["Could not find a download to link this upload to!"]})
    
        if(!version || version == "") version = upload_to.version; 
    
        upload_to.version = version;

        let file = req.file;

        upload_to?.releases.push({
            file_id: file.key,
            version: version,
            notes: notes,
            date: new Date(),
            user_id: res.locals.user.uid
        });

        await upload_to.save();

        return res.json({ done: true, download: upload_to });
    });
});

Route.post("/:id/edit", async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to access this endpoint"] }).status(403);
    
    let {
        name,
        description,
        linkedSubscripton
    } = req.body;

    let id = req.params.id;

    let editingItem = await Downloads.findOne({ id: id });
    
    if(!editingItem) return res.json({ error: true, errors: ["Could not find download that you want to edit"]});

    editingItem.name = name ? name : editingItem.name;
    editingItem.description = description ? description : editingItem.description;
    editingItem.linkedSubscription = linkedSubscripton ? linkedSubscripton : editingItem.linkedSubscription;

    await editingItem.save();

    return res.json({ done: true, item: editingItem });
})

Route.post("/create", async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to access this endpoint"] }).status(403);
    
    let {
        name,
        description,
        linkedSubscription
    } = req.body;

    if(!name) return res.json({ error: true, errors: ["Your download must have a name!"] });
    if(!description) return res.json({ error: true, errors: ["Your download must have a description!"] });
    if(!linkedSubscription) return res.json({ error: true, errors: ["Your download must have a linked subscription!"] });

    const subscription_check = await Subscription.findOne({ id: linkedSubscription });

    if(!subscription_check || subscription_check == null) return res.json({ error: true, errors: ["You need to select a valid subscription!"]});

    let id = uuid();

    let download = await new Downloads({
        id,
        name,
        description,
        linkedSubscription,
        file_Ids: [],
        releases: []
    }).save();

    return res.json({ done: true, download: download });
});

Route.get("/get/all", async (req, res, next) => {
    if(!res.locals.user.permissions.includes("ADMINISTRATOR")) return res.json({ error: true, errors: ["You do not have permission to access this endpoint"] }).status(403);
    
    let downloads = await Downloads.find({});
    
    return res.json({ done: true, downloads: downloads });
});


Route.get("/:id/:version", async (req, res, next) => {
    let isAdmin = res.locals.user.permissions.includes("ADMINISTRATOR") ||  res.locals.user.permissions.includes("MODERATOR");
    let user = res.locals.user;
    let download = await Downloads.findOne({ id: req.params.id });

    const reids : RedisClient = req.app.get('redis');

    if(!download) return res.json({ error: true, errors: ["Could not find download!"] });
    
    let release : any = download.releases.filter((i: any) => i.version == req.params.version);

    if(release.length == 0) return res.json({ error: true, errors: ["Could not find version!"]});

    release = release[0];

    if(!user.active_subscriptions.includes(download.linkedSubscription) && !isAdmin) return res.json({ error: true, errors: ["You dont have permission to access this content!"]});

    let downloadID = uuid();

    reids.set(downloadID, JSON.stringify({ file_id: release.file_id, expire: Date.now() + 3.6e+6 }), (err, res_) => {
        if(err) return res.json({ error: true, errors: ["Internal server errror whilst trying to contact redis!"]});

        res.json({ done: true, download_link: `https://api.wasdcheats.cc/api/v1/uploads/protected/${downloadID}`, expire: 3.6e+6});
    });
}); 
export default Route;