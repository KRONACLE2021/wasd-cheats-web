import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AdminDashboardRoot from '../../components/admin/AdminDashboardRoot';
import DashbaordCard from '../../components/admin/DashboardCard';
import Preloader from '../../components/shared/Preloader';
import styles from '../../styles/admin.module.css';

export default function AdminPanel() {
    const [isLoading, setLoading] = useState(true);

    let userStore = useSelector(state => state.user.user);

    useEffect(() => {
        if(userStore){
            if(userStore.username){
                console.log(userStore);
                if(userStore.permissions.includes("ADMINISTRATOR")) {
                    setLoading(false);
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
                                <li>astrid - Joined 20 Days ago</li>
                            </ul>
                        </DashbaordCard>
                        <DashbaordCard>
                            <h3>Backend server stats</h3>
                            <h1>CPU: 40%</h1>
                            <h1>RAM: 350mb of 1gb</h1>
                        </DashbaordCard>
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}