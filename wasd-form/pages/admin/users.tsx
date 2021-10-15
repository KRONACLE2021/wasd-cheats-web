import moment from 'moment';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminDashboardRoot from '../../components/admin/AdminDashboardRoot';
import DashbaordCard from '../../components/admin/DashboardCard';
import Preloader from '../../components/shared/Preloader';
import { IUser } from '../../interfaces';
import { adminFetchUsers, adminPaginationFetchUsers } from '../../stores/actions/userActions';
import styles from '../../styles/admin.module.css';
import WASDTable from '../../components/shared/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import router from 'next/router';

export default function AdminPanel() {
    const [isLoading, setLoading] = useState(true);

    const dispatch = useDispatch();

    let userStore = useSelector(state => state.user.user);
    let users = useSelector(state => state.user.otherCachedUsers);

    

    const fetchAdminInfo = () => {
      dispatch(adminPaginationFetchUsers(20, 0, userStore.api_key));
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
                    <h1>Manage all users</h1>
                    <div>
                        <input className={styles.admin_input} placeholder={"Search Users"} style={{ width: "250px", marginBottom: "10px"}}></input>   
                        <WASDTable 
                            table_colomns={[
                                "Username",
                                "Email",
                                "Permissions",
                                "ID",
                                "Banned",
                                "Active Subscriptions",
                                "Actions"
                            ]}

                            table_data={users.map(i => {
                                return (
                                    <tr key={i.username}>
                                        <th>{i.username}</th>
                                        <th>{i.email ? i.email : "No permission"}</th>
                                        <th>{i.permissions.map(i => ` ${i},`)}</th>
                                        <th>{i.uid}</th>
                                        <th>{i.banned ? "true" : "false"}</th>
                                        <th>View user to see subscriptions</th>
                                        <th><span onClick={() => {
                                           
                                        }}><FontAwesomeIcon icon={faTrash} /></span><span onClick={() => {
                                           router.push(`/admin/users/${i.uid}/edit`)
                                        }}><FontAwesomeIcon icon={faPen} /></span></th>
                                    </tr>
                                )
                            })}
                        />
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}