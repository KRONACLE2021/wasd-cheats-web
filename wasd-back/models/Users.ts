import { Schema, model } from 'mongoose';


export interface IUser {
    uid: string;
    email: string;
    password: string;
    username: string;
    posts: Array<string>;
    tags: Array<string>;
    avatar?: string;
    permissions: Array<string>;
    api_key: string;
    created_at: Date;
    banned: boolean;
    banId: string | null;
    active_subscriptions: Array<String>;
}


const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    permissions: Array,
    password: { type: String, required: true },
    avatar: String,
    created_at: { type: Date, required: true, default: () => new Date() },
    api_key: String,
    posts: Array,
    uid: String ,
    banned: { type: Boolean, default: false },
    active_subscriptions: Array
});


export default model<IUser>('User', UserSchema);