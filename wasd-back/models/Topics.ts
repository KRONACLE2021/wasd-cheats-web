import { Schema, model } from 'mongoose';

export interface ITopics {
    id: string;
    title: string;
    description: string;
    imgUrl: string;
    createdAt: Date;
    category: string;
    threads: Array<string>;
}


const TopicsSchema = new Schema<ITopics>({
    id: String,
    title: String,
    description: String,
    imgUrl: String,
    category: String,
    threads: Array,
    createdAt: { type: Date, default: () => new Date() }
});


export default model<ITopics>('Topics', TopicsSchema);