import { Schema, model } from 'mongoose';

export interface ISubscription {
    uid: string;
    plan_id: string;
    id: string;
    transaction_id: string;
    date_activated: Date;
    date_end: Date;
}

const UserSubscription = new Schema<ISubscription>({
    uid: String,
    plan_id: String,
    id: String,
    transaction_id: String,
    date_activated: Date,
    date_end: Date
});

export default model<ISubscription>("Subscription", UserSubscription);