import moment from 'moment';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminDashboardRoot from '../../../../components/admin/AdminDashboardRoot';
import FullPageError from '../../../../components/shared/FullpageError';
import Preloader from '../../../../components/shared/Preloader';
import fetchUser from '../../../../requests/getUser';
import styles from '../../../../styles/admin.module.css';

export default function AdminPanel() {


    const router = useRouter();
    const { query: { id } } = router;

    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [userEditing, setUserEditing] = useState({});
    const [fullPageError, setFullPageError] = useState(""); 

    const dispatch = useDispatch();
    let userStore = useSelector(state => state.user.user);

    const fetchAdminInfo = async () => {
        let res = await fetchUser(id, userStore.api_key);

        if(!res.error){
            setUser(res);
            setUserEditing(res);
            setLoading(false);
        } else {
            setFullPageError(res.errors[0]);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(userStore){
            if(userStore.username){
                console.log(userStore);
                if(userStore.permissions.includes("ADMINISTRATOR")) {
                    fetchAdminInfo();
                } else {
                    Router.push("/fourm")  
                }
            }
        } 
    }, [userStore]);

    if(isLoading) return <Preloader />;
    if(fullPageError !== "") return <FullPageError error={fullPageError} code={404} />;

    return (
        <div>
            <AdminDashboardRoot>
                <div className={styles.dashboard_container}>
                    <h1>Editing user {user?.username}</h1>
                    <div className={styles.dashboard_centered}>
                        <div style={{ width: "100%"}}>
                            <div>
                                <p>Username</p>
                                <input placeholder={"Username"} value={userEditing?.username} onChange={(e) => setUserEditing({ ...userEditing, username: e.target.value })} ></input>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}