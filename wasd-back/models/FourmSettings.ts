import { Schema, model } from 'mongoose';

export interface IFourmConifg {
    default_currency: string;
    motd: string;
    default_fourm_role: string;
    enable_signups: boolean;
}