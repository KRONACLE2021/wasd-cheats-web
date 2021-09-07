import React, { useEffect, useState } from 'react';
import FourmRoot from '../../../components/fourm/FourmRoot';
import styles from '../../../styles/fourms.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FetchThreadById } from '../../../stores/actions/threadActions';
import useUserRequest from '../../../requests/useUserRequest';
import axios from 'axios';
import { API, FETCH_USER } from '../../../requests/config';

const ThreadPage: React.FC<any> = (props) => {
    
    const router = useRouter();
    const dispatch = useDispatch();

    const { query: { id } } = router;

    const userStore = useSelector(store => store.user);
    const thread = useSelector(store => store.threadStore.threads.filter((item) => (item["id"] == id)));
    const [loading, setLoading] = useState(true);

    const fetchUser = async (id: string) => {
        let response = await axios.get(`${API}/${FETCH_USER(id)}`)
        .then((res) => res)
        .catch((err) => err.response);

        let data = response.data;

        if(!data.error){
            
        }
    }

    useEffect(() => {
        fetchUser(thread[0].uid);
    }, [thread]);

    useEffect(() => {
        if(id){
            FetchThreadById(id, dispatch);
        }
    }, [id])

    if(loading) <div></div>;

    return (
        <FourmRoot
        header={<>
            <div className={styles.topic_header}>
                <h1 className={styles.header}>{thread[0]?.title}</h1>
                <p>Created By - {} - 7 days ago</p>
            </div>
        </>}>

        </FourmRoot>
    )
}

export default ThreadPage;