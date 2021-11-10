import axios from 'axios';
import { HCAPTHCA_SECRET } from '../config';

export default function VerifyToken(token: string) : Promise<{ success: boolean }> {
    return new Promise((resolve, reject) => {
        axios.post(`https://hcaptcha.com/siteverify`, `secret=${HCAPTHCA_SECRET}&response=${token}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then((res) => {
            let body : any = res.data;
            if(body.success) {
                resolve(body);
            } else {
                reject(body);
            }
        }).catch(err => reject(err));
    });
}