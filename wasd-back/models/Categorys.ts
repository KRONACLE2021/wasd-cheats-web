import { Schema, model } from 'mongoose';

export interface ICategory {
    id: string;
    title: string;
    description: string;
    topics: Array<string>;
}


const CategorySchema = new Schema<ICategory>({
    id: String,
    title: String,
    description: String,
    topics: Array,
});


export default model<ICategory>('Categorys', CategorySchema);