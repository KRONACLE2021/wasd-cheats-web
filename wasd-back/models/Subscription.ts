import { Schema, model } from 'mongoose';

export interface ISubscriptionPlan {
    id: string;
    name: string;
    time_span: number;
}

const SubscriptionPlan = new Schema<ISubscriptionPlan>({
    id: String,
    time_span: Number,
    name: String
});

export default model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlan);