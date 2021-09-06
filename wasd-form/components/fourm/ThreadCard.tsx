import React from 'react';
import styles from '../../styles/fourms.module.css'; 
import { useSelector } from 'react-redux';
import { IThread } from '../../interfaces';


const ThreadCard: React.FC<IThread> = (props) => {
    
    return (
        <div className={styles.thread_card}>
            <div className={styles.thread_info}>
                <h3>{props.title}</h3>
                <p>By {props.uid} </p>
            </div>
        </div>
    )
}

export default ThreadCard;