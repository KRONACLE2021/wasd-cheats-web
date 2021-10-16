import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/login.module.css'; 
import { RegisterUser } from '../stores/actions/userActions';
import { useDispatch } from 'react-redux';
import FourmError from '../components/shared/FourmError';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { HCAPTCHA_SITE_KEY } from '../site_config';

const Login : React.FC<any> = (props) => {
    
    const dispatch = useDispatch();
    const [registerData, setRegisterData] = useState<{ username: string, password: string, email: string, h_captcha?: string }>({ username: "", password: "", email: ""});

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const [errors, setErrors] = useState<Array<string>>([]);

    const submitForm = async () => {
        setSubmitting(true);

        if(registerData.email == "") { setErrors(["You must enter an email!"]); setSubmitting(false); return; }
        if(registerData.password == "") { setErrors(["Enter a password! While you're at it, make sure its really stronk."]); setSubmitting(false); return; }
        if(registerData.username == "") { setErrors(["Enter a username! What are you some sorta nameless person? Odd."]); setSubmitting(false); return; }
        if(registerData.h_captcha == "") { setErrors(["Please complete the captcha"]); setSubmitting(false); return; }


        let res = await RegisterUser({
            email: registerData.email,
            password: registerData.password,
            username: registerData.username,
            h_captcha: registerData.h_captcha
        }, dispatch);

        if(res) {
            if(res.error) {
                setErrors(res.errors);
            }
        } else {
            setErrors(["Could not contact api!"]);
        }    

        setSubmitting(false);
    };  

    console.log(errors);

    return (
        <div className={styles.login_container}>
            <div className={styles.login_box}>
                <div>
                    <h2 className={styles.login_box__header}>Register</h2>
                    <p className={styles.login_box__sml_txt}>Register for a wasd account</p>  
                    { errors.length !== 0 ? ( <> 
                                        <FourmError error={"Error!"} errorDescription={errors[0]} />
                                        <div className={styles.spacer_top}></div> 
                                    </> ) : "" }
                    <div className={styles.login_box__input_fields}>
                        <input placeholder={"username"} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} className={styles.login_input} />
                        <div className={styles.spacer_top}></div>
                        <input placeholder={"email"} onChange={(e) =>  setRegisterData({ ...registerData, email: e.target.value })} className={styles.login_input} />
                        <div className={styles.spacer_top}></div>
                        <input placeholder={"password"} type={"password"} onChange={(e) =>  setRegisterData({ ...registerData, password: e.target.value })} className={styles.login_input} />
                    </div>

                    <div className={styles.spacer_top}></div>
                    <HCaptcha onVerify={(token) => { 
                        setRegisterData({ ...registerData, h_captcha: token })
                    }} sitekey={HCAPTCHA_SITE_KEY}/>
                    <div className={styles.spacer_top}></div>

                    <div className={styles.login_box_buttons}>
                        <button className={`${styles.login_button}`} onClick={submitForm} disabled={isSubmitting}>Create an account</button>
                        <div className={styles.spacer_top}></div>
                    </div>
                </div>


                <div style={{textAlign: "center"}}>
                    <Link href={"/login"}><span style={{color: "grey", cursor: "pointer"}}>Already have an account? Login.</span></Link>
                    <div className={styles.spacer_top}></div>
                </div>

                
            </div>
        </div>
    );
}

export default Login;