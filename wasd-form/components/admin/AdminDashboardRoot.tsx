import React from 'react'
import Navbar from './Navbar';
import styles from '../../styles/admin.module.css';

const AdminDashboardRoot: React.FC<any> = (props) => {
    return (
        <div className={styles.admin_layout_root}>
            <Navbar></Navbar>
            <div className={styles.admin_root}>
                {props.children}
            </div>
        </div>
    )
}

export default AdminDashboardRoot;