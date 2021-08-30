import { Schema, model } from 'mongoose';

export interface IStoreItem {
    id: string;
    price: string;
    description: string;
    currency: string;
    name: string;
    dateAdded: Date;
    stock: Number;
    image: string;
}


const ItemSchema = new Schema<IStoreItem>({
    id: String,
    price: String,
    description: String,
    currency: String,
    name: String,
    dateAdded: { type: Date, default: () => new Date() },
    stock: Number,
    image: String
});


export default model<IStoreItem>('Store_Items', ItemSchema);