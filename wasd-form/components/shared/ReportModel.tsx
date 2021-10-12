import React, { useState, useEffect } from 'react'
import ModelContainer from '../models/ModelContainer';
import FourmError from './FourmError';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import styles from '../../styles/fourms.module.css';
import axios from 'axios';
import { HCAPTCHA_SITE_KEY } from '../../site_config';
import { API, REPORT_POST } from '../../requests/config';
import { useSelector } from 'react-redux';

const ReportModel: React.FC<{ 
    content_type: string, 
    content_id: string,
    modelActive: boolean,
    setModelActive: Function
}> = ({ content_type, content_id, modelActive, setModelActive }) => {

    const userStore = useSelector(state => state.user.user);

    const [errors, setErrors] = useState<Array<any>>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [hasSubmitted, setSubmitted] = useState<boolean>(false);

    const [reportBody, setReportBody] = useState<{ 
        content_type: string, 
        content_id: string, 
        report_context: string,
        h_captcha?: string
    }>({ 
        content_id: content_id, 
        content_type: content_type, 
        report_context: ""
    });


    const reportReasons = [
        "Child pornography/Adult content",
        "Illigal content",
        "Doxing/Harassment of a user"
    ]

    const submitReport = () => {

        setIsSubmitting(true);

        if(!userStore.api_key) return setErrors(["Invalid api key!!"]);

        let endpoint = "";
        switch(content_type) {
            case "POST":
                endpoint = REPORT_POST;
                break;
            default: 
                return;
        }

        axios.post(`${API}/${endpoint}`, reportBody, {
            headers: {
                Authorization: userStore.api_key
            }
        }).then((res) => {
            let body = res.data;
            if(body.error) {
                setErrors(body.errors);
            }
            
            setSubmitted(true);
        }).catch((err) => {
            console.log(err);
            setErrors(["Error connecting to WASD api!"])
        });

        setIsSubmitting(false);
    }

    return (
        <ModelContainer isActive={modelActive} setModelActive={setModelActive}>
            <div style={{ padding: "10px 25px"}}>
                { hasSubmitted ? (
                    <div>
                        <h2>Thank you for reporting this content!</h2>    
                        <p>Thank you for keeping WASD a safe space!</p>
                    </div>
                ) : (
                <div>
                    <h2>Report content.</h2>
                    <div style={{ padding: "0px  10px", marginBottom: "10px"}} className={styles.report_model_content}> 
                        {reportReasons.map((report_reason) => {
                            return (
                                <div>
                                    <input type={"checkbox"} onChange={(e) => setReportBody({ ...reportBody, report_context: e.target.value})} checked={reportBody.report_context == report_reason ? true : false} value={report_reason}></input>
                                    <p>{report_reason}</p>
                                </div>
                            )
                        })}
                        <p className={styles.report_model_bottom_text}>By submitting this form you agree that this report is valid, any false reporting may result in a ban</p>
                        <HCaptcha 
                            sitekey={HCAPTCHA_SITE_KEY}
                            onVerify={(token) => {
                                setReportBody({ ...reportBody, h_captcha: token });
                            }}
                        />
                        <button onClick={() => submitReport()} className={styles.delete_button}>Submit report</button>
                    </div> 
                </div> ) }
            </div>
        </ModelContainer>
    );
}

export default ReportModel;