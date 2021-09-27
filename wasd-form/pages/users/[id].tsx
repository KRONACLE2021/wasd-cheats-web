import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from '../../styles/fourms.module.css';
import getAvatar from '../../utils/getAvatar';
import getUserPermission from '../../utils/getUserPermission';

export default function UserPage() {
    
    const router = useRouter();
    const { query: { id } } = router;
    const [user, setUser] = useState(null);

    const userStore = useSelector(state => state.user);



    console.log(userStore);

    useEffect(() => {
        if(id == "me") {
            if(!userStore.uid){
                router.push('/login')
            } else {
                setUser(userStore);
            }
        }
    }, [userStore]);


    useEffect(() => {
        if(id !== "me"){

        }
    }, [id]);

    return (
        <div style={{ display: "flex", alignItems: "center", maxWidth: "100%", justifyContent: "center"}}>
            <div className={styles.fourm_user_page_container}>
                <div className={styles.user_stats_container}>
                    <img src={"/test-banner.jpg"} className={styles.user_banner}/>
                    <div className={styles.user_info_flex}>
                        <img src={getAvatar(user)} className={styles.user_avatar}></img>
                        <div className={styles.user_stats_items}>
                            <h1>{userStore?.username}</h1>
                            <p>{getUserPermission(userStore?.permissions)}</p>
                        </div>
                        <p></p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}