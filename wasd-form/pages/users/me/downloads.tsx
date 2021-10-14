import React from 'react';
import DownloadCard from '../../../components/settings/DownloadCard';
import styles from '../../../styles/settings.module.css';

export default function downlaods() {
    return (
        <div className={styles.main_container}>
            <div className={styles.main_container_inner}>
                <h1>Your downloads:</h1>
                <p>Downloads for products you've purchased</p>
                <div>
                    <DownloadCard 
                        name={"WASD EFT"}
                        description={"Tarkov WASD EFT"}
                        version={"v6.9.4"}
                        content_id={"00000-00000-0000-0000"}
                        subscription_status={{ time_left: "Lifetime" }}
                    />
                    
                </div>
            </div>
        </div>
    );
}
