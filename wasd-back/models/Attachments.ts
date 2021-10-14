import { Schema, model } from 'mongoose';

export interface IAttachment {
    id: string;
    name: string;
    attachedTo: string;
    altText: string;
    url: string;
    uid: string;
    size: string;
}


const AttachmentSchema = new Schema<IAttachment>({
    id: String,
    name: String,
    altText: String,
    attachedTo: String,
    url: String,
    uid: String,
    size: String
});


export default model<IAttachment>('Attachments', AttachmentSchema);