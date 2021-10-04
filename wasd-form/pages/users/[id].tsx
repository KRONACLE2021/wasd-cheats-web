import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from '../../styles/fourms.module.css';
import getAvatar from '../../utils/getAvatar';
import getUserPermission, { getPermissionColor } from '../../utils/getUserPermission';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { FetchUsersPosts } from '../../stores/actions/userActions';
import PostCard from '../../components/fourm/PostCard';
import SimplePostCard from '../../components/fourm/SimplePostCard';

export default function UserPage() {
    
    const router = useRouter();
    const { query: { id } } = router;
    const [user, setUser] = useState(null);
    const dispatcher = useDispatch();

    const userStore = useSelector(state => state.user.user);

    console.log(userStore);

    useEffect(() => {
        if(id == "me") {
            if(!userStore.uid){
                router.push('/login')
            } else {
                setUser(userStore);
            }
        }
    }, [userStore, id]);


    useEffect(() => {
        if(user?.uid){
            dispatcher(FetchUsersPosts(user.uid));
        }
    }, [user]);

    return (
        <div style={{ display: "flex", alignItems: "center", maxWidth: "100%", justifyContent: "center"}}>
            <div className={styles.fourm_user_page_container}>
                <div className={styles.user_stats_container}>
                    <img src={"/test-banner.jpg"} className={styles.user_banner}/>
                    <div className={styles.user_info_flex}>
                        <img src={getAvatar(user)} className={styles.user_avatar}></img>
                        <div className={styles.user_stats_items}>
                            <h1>{user?.username}</h1>
                            <p className={getPermissionColor(user?.permissions)}>{getUserPermission(user?.permissions)}</p>
                        </div>
                    </div>
                    <div className={styles.user_page_content}>
                        <div className={styles.about_user}>
                            <h2>About</h2>
                            <p>We dont know much about {user?.username}</p>
                            <p className={styles.user_about_text}>Created account {moment(user?.created_at).format('MMMM Do YYYY')}</p>
                            {userStore?.permissions?.includes("MODERATOR") &&  getUserPermission(user?.permissions, "permission_int") < getUserPermission(userStore?.permissions,  "permission_int") ? <div> 
                                <p>Admin Actions:</p>
                                <button>Ban User</button>
                                <button>Delete all posts</button>
                                <button>Reset Profile information</button>
                            </div>: ""}
                            {userStore?.permissions?.includes("MODERATOR") ? <div>
                                <p>Admin Stats:</p>
                                <p>Current active subscription: None</p> 
                                <p>Last logged in IP: <span style={{ color: "red"}}>Protected IP User</span></p>
                                <button className={styles.admin_action_button}>View users content</button>
                            </div>: ""}
                        </div>
                        <div className={styles.user_posts}>
                            <h3>Posts:</h3>
                            {user?.posts.map(i => {
                                return <SimplePostCard    
                                    key={i.id} 
                                    id={i.id}
                                    contents={i.contents} 
                                    postOwner={user}
                                    createdAt={i.createdAt}
                                    attachments={i.attachments} 
                                /> 
                            })}
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}