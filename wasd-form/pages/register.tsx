import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/login.module.css'; 
import { RegisterUser } from '../stores/actions/userActions';
import { useDispatch } from 'react-redux';

const Login : React.FC<any> = (props) => {
    
    const dispatch = useDispatch();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const [errors, setErrors] = useState<Array<string>>([]);

    const submitForm = async () => {
        setSubmitting(true);

        let res = await RegisterUser({
            email: email,
            password: password,
            username: username
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

                    <div className={styles.login_box__input_fields}>
                        <input placeholder={"username"} onChange={(e) =>  setUsername(e.target.value)} className={styles.login_input} />
                        <div className={styles.spacer_top}></div>
                        <input placeholder={"email"} onChange={(e) =>  setEmail(e.target.value)} className={styles.login_input} />
                        <div className={styles.spacer_top}></div>
                        <input placeholder={"password"} type={"password"} onChange={(e) =>  setPassword(e.target.value)} className={styles.login_input} />
                    </div>

                    <div className={styles.spacer_top}></div>
                    <div className={styles.spacer_top}></div>

                    <div className={styles.login_box_buttons}>
                        <button className={`${styles.login_button} ${styles.discord_login}`} disabled={isSubmitting}>Register With Discord</button>
                        <div className={styles.spacer_top}></div>
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