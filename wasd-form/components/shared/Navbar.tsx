import React, { useEffect, useState } from 'react';
import styles from '../../styles/navigation.module.css';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';


const Navbar : React.FC<any> = (props) => {
    
    let userStore = useSelector(state => state.user);

    return (
        <div className={styles.navbar_container}>
            <img src={"/logo.png"} className={styles.logo}/>
            <nav>
                <ul className={styles.nav_links}>
                    <li><Link href={"/fourm"}>Fourms</Link></li>
                    <li><Link href={"/fourms"}>Shop</Link></li>
                    <li><Link href={"/fourms"}>Pricing</Link></li>
                </ul>
            </nav>
            {userStore.username !== undefined ? (
                <>
                    <div className={styles.logged_in_user}>
                        <img src={userStore.avatar !== "" ? userStore.avatar : `https://avatars.dicebear.com/api/jdenticon/${userStore.uid}.svg`}></img>
                        <p className={styles.logged_in_user_username}>{userStore.username}</p>

                        <div className={styles.logged_in_dropdown}>
                            <div className={styles.signed_in_as}>
                                <p>Singed in as</p>
                                <h3>{userStore.username}</h3>
                            </div>
                            <ul className={styles.drop_down_list}>
                                <li><Link href={"/logout"}>Logout</Link></li>
                                <li><Link href={"/user"}>Profile</Link></li>
                                <li><Link href={"/user/settings"}>Settings</Link></li>
                                {userStore.username !== undefined ? (userStore.permissions.includes("ADMINISTRATOR") ? (
                                    <>
                                        <li>Admin Panel</li>
                                        <li>Moderator</li>
                                    </>
                                ) : "") : "" }
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <button onClick={() => {
                    Router.push("/login");
                }} className={styles.login_button}>Login</button>
            )}
        </div>
    );
}

export default Navbar;