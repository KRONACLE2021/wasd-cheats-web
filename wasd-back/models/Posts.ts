import { Schema, model } from 'mongoose';

export interface IPost {
    id: string;
    contents: string;
    attachments: Array<string>;
    uid: string;
    threadId: string;
    refrenced_post_id: string | null;
}


const PostsSchema = new Schema<IPost>({
    id: String,
    contents: String,
    uid: String,
    threadId: String,
    attachments: Array,
    refrenced_post_id: String 
});


export default model<IPost>('Posts', PostsSchema);