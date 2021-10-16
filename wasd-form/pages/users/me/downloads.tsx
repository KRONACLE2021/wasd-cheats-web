import React, { useState, useEffect } from 'react';
import DownloadCard from '../../../components/settings/DownloadCard';
import styles from '../../../styles/settings.module.css';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import Preloader from '../../../components/shared/Preloader';
import { API, GET_USERS_DOWNLOADS } from '../../../requests/config';

export default function downlaods() {

    const [downloadsData, setDownloadsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const userStore = useSelector(state => state.user.user);
    const isLoading = useSelector(state => state.user.loading);

    const getData = async () => {
        axios.get(`${API}/${GET_USERS_DOWNLOADS}`, {
            headers: {
                Authorization: userStore.api_key
            }
        }).then(res => {
            if(!res.error){
                setDownloadsData(res.data.downloads);
                setLoading(false);
            }
        }).catch(err => {
            console.log(err);
        }) 
    }

    useEffect(() => {
        if(!userStore.uid){
            if(isLoading){
    
            } else {
                Router.push("/login?after=/users/me/downloads");
            }
        } else {
            getData();
        }
    }, [userStore]);

    if(loading) return <Preloader></Preloader>;

    return (
        <div className={styles.main_container}>
            <div className={styles.main_container_inner}>
                <h1>Your downloads:</h1>
                <p>Downloads for products you've purchased</p>
                <div>
                    {downloadsData?.map((i) => {

                        let release = i?.releases[i.releases.length - 1];

                        return <DownloadCard 
                            name={i.name}
                            version={release ? release.version : "No release yet!"}
                            id={i.id}
                            api_key={userStore.api_key}
                        />
                    })}
                </div>
            </div>
        </div>
    );
}
