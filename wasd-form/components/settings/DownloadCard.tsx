import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import moment from 'moment';
import React from 'react'
import { API, INITATE_PROTECTED_DOWNLOAD } from '../../requests/config';
import styles from '../../styles/settings.module.css';

const DownloadCard: React.FC<{ 
    name: string, 
    description: string, 
    version: string, 
    content_id: string, 
    subscription_status: { time_left: number }, 
    userId: string, 
    date: Date,
    id: id,
    api_key: string
}> = ({ name, userId, description, version, content_id, subscription_status, date, id, api_key }) => {


    const initateDownload = async () => {
        await axios.get(`${API}/${INITATE_PROTECTED_DOWNLOAD(id, version)}`, {
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            let data = res.data;
            if(!data.error) {
                if(data.download_link) {
                    window.open(data.download_link);
                }
            }
        })
    }

    return (
        <div className={styles.download_card}>
            <h1 className={styles.download_title}>{name} - {version}</h1>
            <p>{userId ? "" : "Unknown user"} released this {moment(date).format('MMMM Do YYYY')}</p>
            <p className={styles.download_description}>{description}</p>
            <button className={styles.download_button} onClick={() => initateDownload()}><FontAwesomeIcon icon={faDownload} /> Download</button>
            <div className={styles.spacer}></div>
        </div>
    )
}

export default DownloadCard;