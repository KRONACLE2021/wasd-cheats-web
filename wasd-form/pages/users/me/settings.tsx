import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import styles from '../../../styles/fourms.module.css';
import { useSelector } from 'react-redux';
import FileUploader from '../../../components/fourm/FileUploader';
import { BASE_IMAGE_URL } from '../../../requests/config';


export default function UserSettings() {

    const [userUpdateBody, setUserUpdateBody] = useState({ bio: "", username: "", banner: "", avatar: ""});
    const [initalLoad, setInitalLoad] = useState(true);
    const userStore = useSelector(state => state.user.user);
    const isLoading = useSelector(state => state.user.loading);

    useEffect(() => {
        if(!userStore.uid){
            console.log(userStore, isLoading);
            if(isLoading){
    
            } else {
                Router.push("/login?after=/users/me/settings");
            }
        } else {
            if(initalLoad){
                setUserUpdateBody({ bio: userStore.bio, username: userStore.username, banner: userStore.banner, avatar: userStore.avatar });
                setInitalLoad(false);
            }
        }
    }, [userStore]);

    const updateProfile = () => {
        
    }

    return (
        <div className={styles.root_page_container}>
            <h1>User Settings</h1>
            <p>Here is where you can manage your profile!</p>
            <div>
                <div>
                    <p>Bio (max 255 chars)</p>
                    <textarea className={styles.input} value={userUpdateBody.bio} onChange={(e) => setUserUpdateBody({ ...userUpdateBody, bio: e.target.value })} placeholder={"Your bio"}></textarea>
                </div>
                <div>
                    <p>Username (Your username can only be changed every 3 months)</p>
                    <input className={styles.input} value={userUpdateBody.username} onChange={(e) => setUserUpdateBody({ ...userUpdateBody, username: e.target.value })} placeholder={"Current username"}></input>
                </div>
                <div>
                    <p>Banner</p>
                    <img style={{ maxHeight: "150px" }} src={BASE_IMAGE_URL(userUpdateBody.banner)} />
                    <FileUploader uploadType={"banner"} output={(imageId) => setUserUpdateBody({ ...userUpdateBody, banner: imageId })} reccomended_size={"1920x1080 (20MB)"} />
                </div>
                <div>
                    <p>Avatar</p>
                    <img  style={{ maxHeight: "150px" }} src={BASE_IMAGE_URL(userUpdateBody.avatar)} />
                    <FileUploader output={(imageId) => setUserUpdateBody({ ...userUpdateBody, avatar: imageId })} uploadType={"avatar"} reccomended_size={"1920x1080 (20MB)"} />
                </div>
                <button className={styles.thread_create}>Update Profile</button>
            </div>
        </div>
    );
} 