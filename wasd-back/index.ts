import express from 'express';
import Router from './routes';
import Mongoose from 'mongoose'; 

require('dotenv').config();

let app = express();

/* Init the main router */
app.use("/", Router);

app.listen(process.env.PORT, () => {
    Mongoose.connect("mongodb://admin:tB26E7Fgpfs9cDWp@143.110.214.153/").then(() => {
        console.log("[DATABASE] Connected to mongodb");
    });

    console.log("[STARTUP] wasd backend started on port " + process.env.PORT);
});