import { Schema, model } from 'mongoose';

export interface IThread {
    id: string;
    title: string;
    uid: string;
    createdAt: Date;
    topicId: string;
    locked: boolean;
    posts: Array<string>;
}


const PostsSchema = new Schema<IThread>({
    id: String,
    title: String,
    topicId: String,
    uid: String,
    locked: Boolean,
    posts: Array,
    createdAt: { type: Date, defualt: () => new Date(), required: true }
});


export default model<IThread>('Posts', PostsSchema);