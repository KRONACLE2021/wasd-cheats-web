import { Router } from "express";
import cors from 'cors';
import PostsRoute from './posts/posts'; 
import TopicsRoute from './posts/topics';
import ThreadsRoute from './posts/threads';
import AuthRoute from './auth';
import Categorys from './posts/categorys';
import StoreAdmin from './store/admin';
import UserRoutes from './user';

let Route = Router();

Route.use(cors());

Route.get("/api/status", (req, res, next) => {
    res.json({status: "online"});
})

Route.use("/api/v1/auth", AuthRoute);

/* User content routes */
Route.use("/api/v1/topics", TopicsRoute);
Route.use("/api/v1/categorys", Categorys);
Route.use("/api/v1/threads", ThreadsRoute);
Route.use('/api/v1/posts', PostsRoute);

/* User Routes */
Route.use("/api/v1/users", UserRoutes);

/* Store Routes */
Route.use("/api/v1/shop/admin", StoreAdmin);


export default Route;