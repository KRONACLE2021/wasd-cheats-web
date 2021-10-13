import React from 'react'
import styles from '../../styles/fourms.module.css';

const InfoBanner: React.FC<{ title?: string, message: string }> = ({ title, message }) => {
    return (
        <div className={styles.info_banner_container}>
            <div className={styles.info_banner_content}>
                <h1>{title ? title : "Info!"}</h1>
                <p>{message}</p>
            </div>
        </div>
    )
} 

export default InfoBanner;