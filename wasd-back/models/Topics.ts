import { Schema, model } from 'mongoose';

export interface ITopics {
    id: string;
    title: string;
    description: string;
    imgUrl: string;
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
});


export default model<ITopics>('Topics', TopicsSchema);