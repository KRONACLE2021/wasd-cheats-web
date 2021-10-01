import React from 'react';
import styles from '../../styles/admin.module.css';


const DashbaordCard: React.FC<any> = (props) => {
    return (
        <div className={styles.dashboard_card_container}>
            {props.children}
        </div>
    )
}

export default DashbaordCard;