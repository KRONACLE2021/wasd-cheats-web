import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styles from '../styles/login.module.css'; 
import { LoginUser } from '../stores/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import FourmError from '../components/shared/FourmError';

const Login : React.FC<any> = (props) => {
    
    const dispatch = useDispatch();

    const userStore = useSelector(state => state.user);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [isLoading, setLoading] = useState<boolean>(false);
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

        let res = await LoginUser({
            username: email,
            password: password
        }, dispatch);

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
                        <input placeholder={"email/username"} onChange={(e) =>  setEmail(e.target.value)} className={styles.login_input} />
                        <div className={styles.spacer_top}></div>
                        <input placeholder={"password"} type={"password"} onChange={(e) =>  setPassword(e.target.value)} className={styles.login_input} />
                    </div>

                    <div className={styles.spacer_top}></div>
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