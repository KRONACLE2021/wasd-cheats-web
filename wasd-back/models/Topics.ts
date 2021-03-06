import { Schema, model } from 'mongoose';

export interface ITopics {
    id: string;
    title: string;
    description: string;
    imgID: string;
    createdAt: Date;
    category: string;
    locked: boolean;
    threads: Array<string>;
}


const TopicsSchema = new Schema<ITopics>({
    id: String,
    title: String,
    description: String,
    imgID: String,
    category: String,
    threads: Array,
    createdAt: { type: Date, default: () => new Date() },
    locked: Boolean
});


export default model<ITopics>('Topics', TopicsSchema);