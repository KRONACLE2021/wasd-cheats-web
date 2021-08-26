import { Schema, model } from 'mongoose';

export interface IThread {
    id: string;
    title: string;
    uid: string;
    topicId: string;
    posts: Array<string>;
}


const PostsSchema = new Schema<IThread>({
    id: String,
    title: String,
    topicId: String,
    uid: String,
    posts: String
});


export default model<IThread>('Posts', PostsSchema);