import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import styles from '../../styles/settings.module.css';

const DownloadCard: React.FC<{ name: string, description: string, version: string, content_id: string, subscription_status: { time_left: number } }> = ({ name, description, version, content_id, subscription_status }) => {
    return (
        <div className={styles.download_card}>
            <h1 className={styles.download_title}>{name} - {version}</h1>
            <p className={styles.download_description}>{description} - Remaining time: { subscription_status?.time_left }</p>
            <button className={styles.download_button}><FontAwesomeIcon icon={faDownload} /> Download</button>
            <div className={styles.spacer}></div>
        </div>
    )
}

export default DownloadCard;