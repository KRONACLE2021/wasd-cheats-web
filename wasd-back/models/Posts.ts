import { Schema, model } from 'mongoose';

interface IPost {
    id: string;
    title: string;
    contents: string;
    uid: string;
    threadId: string;
}


const PostsSchema = new Schema<IPost>({
    id: String,
    title: String,
    contents: String,
    uid: String,
    threadId: String,
});


export default model<IPost>('User', PostsSchema);