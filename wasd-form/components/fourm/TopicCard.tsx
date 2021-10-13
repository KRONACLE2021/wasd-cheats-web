import React from 'react'
import Router from 'next/router';
import styles from '../../styles/fourms.module.css';

const PostCard: React.FC<{ title: string, description: string, imgUrl: string, id: string, threadAmount: number }> = (props) => {
    return (
        <div onClick={() => {
            Router.push(`/fourm/topics/${props.id}`);            
        }} className={styles.topic_card_container}>
            <div className={styles.topic_card_image}>
                <img src={props.imgUrl}></img>
            </div>
            <div>
                <h2 className={styles.topic_title}>{props.title}</h2>
                <p className={styles.topic_description}>{props.description}</p>
            </div>
            <div className={styles.topic_stats_container}>
                <div className={styles.topic_stats}>
                    <h3>{props.threadAmount}</h3>
                    <h4>Topics</h4>
                </div>
            </div>
        </div>
    )
} 

export default PostCard;