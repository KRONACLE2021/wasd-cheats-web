import { Schema, model } from 'mongoose';

export interface IReport {
    id: string;
    uid: string;
    content_id: string;
    content_type: "POST" | "ATTACHMENT" | "THREAD" | "USER";
    resolved: boolean;
    closed_by: string | null;
    report_context: string | null;
}


const ReportSchema = new Schema<IReport>({
    id: String,
    uid: String,
    content_id: String,
    content_type: String,
    resolved: Boolean,
    closed_by: String,
    report_context: String
});


export default model<IReport>('Reports', ReportSchema);;