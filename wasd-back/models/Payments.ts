import { Schema, model } from 'mongoose';

export interface IPayment {
    uid: string;
    id: string;
    payment_processor_id: string;
    date: Date;
    payment_procesor: string;
}


const PaymentSchema = new Schema<IPayment>({
    uid: String,
    id: String,
    payment_processor_id: String,
    payment_procesor: String,
    date: { default: new Date(), type: Date }
});


export default model<IPayment>('Payment', PaymentSchema);