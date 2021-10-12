import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styles from '../styles/login.module.css'; 
import { LoginUser } from '../stores/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import FourmError from '../components/shared/FourmError';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Login : React.FC<any> = (props) => {
    
    const dispatch = useDispatch();

    const userStore = useSelector(state => state.user);

    const [loginBody, setLoginBody] = useState<{ h_captcha?: string | undefined | null, username: string, password: string}>({ username: "", password: "" });
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const [errors, setErrors] = useState<Array<string>>([]);

    
    useEffect(() => {
        if(userStore){
            if(userStore.user.username){
                Router.push("/fourm");
            }
        }
    }, [userStore]);

    const submitForm = async () => {
        setSubmitting(true);

        let res = await LoginUser(loginBody, dispatch);

        if(res) {
            if(res.error) {
                setErrors(res.errors);
            } else {
                Router.push("/fournm");
            }
        } 

        setSubmitting(false);
    };  

    return (
        <div className={styles.login_container}>
            <div className={styles.login_box}>
                <div>
                    <h2 className={styles.login_box__header}>Login</h2>
                    <p className={styles.login_box__sml_txt}>Login to your wasd account</p>  
                        { errors.length !== 0 ? ( <> 
                                        <FourmError error={"Error!"} errorDescription={errors[0]} />
                                        <div className={styles.spacer_top}></div> 
                                    </> ) : "" }
                    <div className={styles.login_box__input_fields}>
                        <input placeholder={"email/username"} onChange={(e) =>  setLoginBody({ ...loginBody, username: e.target.value })} className={styles.login_input} />
                        <div className={styles.spacer_top}></div>
                        <input placeholder={"password"} type={"password"} onChange={(e) =>  setLoginBody({ ...loginBody, password: e.target.value })} className={styles.login_input} />
                    </div>

                    <div className={styles.spacer_top}></div>
                    <HCaptcha onVerify={(token) => { 
                        setLoginBody({ ...loginBody, h_captcha: token })
                    }} sitekey={"10000000-ffff-ffff-ffff-000000000001"}/>
                    <div className={styles.spacer_top}></div>

                    <div className={styles.login_box_buttons}>
                        <button className={`${styles.login_button} ${styles.discord_login}`} disabled={isSubmitting}>Login With Discord</button>
                        <div className={styles.spacer_top}></div>
                        <button className={`${styles.login_button}`} onClick={submitForm} disabled={isSubmitting}><span className="button_loader_text">Login</span> { isSubmitting ? ( <div className="loader_"></div> ) : "" }</button>
                        <div className={styles.spacer_top}></div>
                    </div>
                </div>


                <div style={{textAlign: "center"}}>
                    <Link href={"/register"}><span style={{color: "grey", cursor: "pointer"}}>Dont have an account? Make one.</span></Link>
                    <div className={styles.spacer_top}></div>
                </div>

                
            </div>
        </div>
    );
}

export default Login;