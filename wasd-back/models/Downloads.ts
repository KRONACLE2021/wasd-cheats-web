import { Schema, model } from 'mongoose';

export interface IDownload {
    id: string;
    name: string;
    version: string;
    description: string;
    linkedSubscription: string;
    releases: Array<{ file_id: string; version: string; notes: string; date: Date; }>;
    file_ids: Array<string>;
}


const DownloadsSchema = new Schema<IDownload>({
    id: String,
    name: String,
    version: String,
    description: String,
    linkedSubscription: String,
    releases: Array,
    file_ids: Array
});


export default model<IDownload>('Downloads', DownloadsSchema);