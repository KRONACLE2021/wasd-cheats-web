import moment from 'moment';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminDashboardRoot from '../../components/admin/AdminDashboardRoot';
import DashbaordCard from '../../components/admin/DashboardCard';
import Preloader from '../../components/shared/Preloader';
import { IUser } from '../../interfaces';
import { adminFetchUsers } from '../../stores/actions/userActions';
import styles from '../../styles/admin.module.css';

export default function AdminPanel() {
    const [isLoading, setLoading] = useState(true);

    const dispatch = useDispatch();

    let userStore = useSelector(state => state.user.user);
    let recentUserStore = useSelector(state => state.user.otherCachedUsers);

    const fetchAdminInfo = () => {
        dispatch(adminFetchUsers("RECENT", userStore.api_key));
    }

    useEffect(() => {
        if(userStore){
            if(userStore.username){
                console.log(userStore);
                if(userStore.permissions.includes("ADMINISTRATOR")) {
                    setLoading(false);
                    fetchAdminInfo();
                } else {
                    Router.push("/fourm")  
                }
            }
        } 
    }, [userStore]);

    if(isLoading) return <Preloader />;

    return (
        <div>
            <AdminDashboardRoot>
                <div className={styles.dashboard_container}>
                    <h1>Welcome to your dashboard!</h1>
                    <div className={styles.dash_items_container}>
                        <DashbaordCard>
                            <h3>Recent users</h3>
                            <ul>
                                {recentUserStore?.map((recentUser_: IUser) => {
                                    return <li>{recentUser_.username} - Joined {moment(recentUser_.created_at).format('MMMM Do YYYY')}</li>
                                })}
                            </ul>
                        </DashbaordCard>
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}