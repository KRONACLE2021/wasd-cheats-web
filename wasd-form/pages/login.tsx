import React, { useState } from 'react';
import styles from '../styles/login.module.css'; 
import { useDispatch } from 'react-redux';

const Login : React.FC<any> = (props) => {
    
    const dispatch = useDispatch();

    


    return (
        <div className={styles.login_container}>
            <div className={styles.login_box}>
                <div>
                    <h2 className={styles.login_box__header}>Login</h2>
                    <p className={styles.login_box__sml_txt}>Login to your wasd account</p>  

                    <div className={styles.login_box__input_fields}>
                        <input placeholder={"email/username"} className={styles.login_input} />
                        <div className={styles.spacer_top}></div>
                        <input placeholder={"password"} type={"password"} className={styles.login_input} />
                    </div>

                    <div className={styles.spacer_top}></div>
                    <div className={styles.spacer_top}></div>

                    <div className={styles.login_box_buttons}>
                        <button className={`${styles.login_button} ${styles.discord_login}`}>Login With Discord</button>
                        <div className={styles.spacer_top}></div>
                        <button className={`${styles.login_button}`}>Login</button>
                        <div className={styles.spacer_top}></div>
                    </div>
                </div>


                <div style={{textAlign: "center"}}>
                    <p style={{color: "grey"}}>Don't have an account? Sign up.</p>
                </div>

                
            </div>
        </div>
    );
}

export default Login;