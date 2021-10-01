import { Schema, model } from 'mongoose';

export interface IUserBan {
    id: string;
    uid: string;
    bannedBy: string;
    banReason: string;
}


const UserBan = new Schema<IUserBan>({
    id: String,
    uid: String,
    bannedBy: String,
    banReason: String
});


export default model<IUserBan>('UserBan', UserBan);