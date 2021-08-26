import { Router } from "express";
import PostsRoute from './posts/posts'; 
import TopicsRoute from './posts/topics';
import AuthRoute from './auth';

let Route = Router();

Route.get("/api/v1/auth", AuthRoute);

/* User content routes */
Route.get("api/v1/topics", TopicsRoute);
Route.get('/api/v1/posts', PostsRoute);

export default Route;