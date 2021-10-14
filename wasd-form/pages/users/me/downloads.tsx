import React from 'react';
import styles from '../../../styles/settings.module.css';

export default function downlaods() {
    return (
        <div className={styles.main_container}>
            <div className={styles.main_container_inner}>
                <h1>Your downloads:</h1>
                <p>Downloads for products you've purchased</p>
            </div>
        </div>
    );
}
