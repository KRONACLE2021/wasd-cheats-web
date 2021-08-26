import { Schema, model } from 'mongoose';

interface IUser {
    uid: number;
    email: string;
    password: string;
    username: string;
    posts: Array<string>;
    tags: Array<string>;
    avatar?: string;
    permissions: Array<string>;
    api_key: string;
    created_at: Date;
}


const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: String,
    created_at: { type: Date, required: true, default: () => new Date() },
    api_key: String,
    posts: Array,
    uid: String 
});


export default model<IUser>('User', UserSchema);