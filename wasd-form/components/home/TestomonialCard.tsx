import React from 'react';
import styles from '../../styles/Home.module.css';

const ReviewCard:React.FC<{
    username: string,
    profile_picture: string,
    review: string 
}> = ({ username, profile_picture, review}) => {
    return (
        <div className={styles.user_review_card}>
            <img src={profile_picture} />
            <h1>{username}</h1>
            <p>{review}</p>
        </div>
    )
}

export default ReviewCard;