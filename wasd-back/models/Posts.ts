import { Schema, model } from 'mongoose';

export interface IPost {
    id: string;
    contents: string;
    attachments: Array<string>;
    uid: string;
    threadId: string;
}


const PostsSchema = new Schema<IPost>({
    id: String,
    contents: String,
    uid: String,
    threadId: String,
    attachments: Array
});


export default model<IPost>('Posts', PostsSchema);