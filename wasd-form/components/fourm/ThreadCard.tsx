import React from 'react';
import styles from '../../styles/fourms.module.css'; 
import { useSelector } from 'react-redux';
import { IThread } from '../../interfaces';
import useUserRequest from '../../requests/useUserRequest';
import Router from 'next/router';

const ThreadCard: React.FC<IThread> = (props) => {

    
    let user = useUserRequest(props.uid);

    console.log(user);


    return (
        <div onClick={() => Router.push(`/fourm/threads/${props.id}`)} className={styles.thread_card}>
            <div className={styles.thread_info}>
                <div className={styles.thread_title_container}>
                    <h3 className={styles.thread_title}>{props.title}</h3>
                </div>
                <p className={styles.thread_descriptor}>By {user?.username} - {props.createdAt} </p>
            </div>
            <div className={styles.thread_stats}>
                <p>{props.posts.length - 1} replies</p>
                <p>0 views</p>
            </div>
        </div>
    )
}

export default ThreadCard;