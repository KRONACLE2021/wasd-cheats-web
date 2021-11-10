import express from 'express';
import Router from './routes';
import Mongoose from 'mongoose'; 
import Redis from 'redis';

require('dotenv').config();

let app = express();

/* Init the main router */
app.use("/", Router);

app.listen(process.env.PORT, () => {
    Mongoose.connect("mongodb://mongo:cuDZYa9YoRsfPxTimEUE@containers-us-west-19.railway.app:6939").then(() => {
        console.log("[DATABASE] Connected to mongodb");
    });

    let RedisClient = Redis.createClient({
        host: "64.180.181.199",
        port: 6379
    });

    app.set("redis", RedisClient);

    console.log("[STARTUP] wasd backend started on port " + process.env.PORT);
});