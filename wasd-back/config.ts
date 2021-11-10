//@ts-ignore
import dotenv from 'dotenv';
dotenv.config();

export const HCAPTHCA_SECRET = process.env.HCAPTCHA_SECRET ? process.env.HCAPTCHA_SECRET : "0x0000000000000000000000000000000000000000";