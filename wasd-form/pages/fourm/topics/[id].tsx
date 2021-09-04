import React, { useEffect } from 'react';
import styles from '../../../styles/fourms.module.css';
import FourmRoot from '../../../components/fourm/FourmRoot';
import { FetchTopicById } from '../../../stores/actions/topicActions';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

const TopicPage : React.FC<any> = () => {
    

    const router = useRouter();
    const dispatch = useDispatch();
    
    const { query: { id } } = router;

    const topics = useSelector(state => state.topics.topics.filter((item) => (item["id"] == id)));

    const fetchTopic = async () => {
        let res = await FetchTopicById(id, dispatch);

        if(res.error) { 
            console.log(res);
        }
    }

    useEffect(() => {
        if(topics.length == 0) {
            fetchTopic();
        }
    }, [topics]);

    console.log(topics);

    return (

        <FourmRoot header={
            topics[0] !== undefined ? (
                <>
                    <div className={styles.topic_header}>
                        <h1 className={styles.header}>{topics[0].title}</h1>
                        <p>{topics[0].description}</p>
                    </div>
                    <div className={styles.thread_create_container}>
                            <button className={styles.thread_create}>Start a thread</button>
                    </div>
                    <div className={styles.fourm_container}>
                    </div>
                </>
            ) : ""
        }>
        </FourmRoot>
    );
}

export default TopicPage;