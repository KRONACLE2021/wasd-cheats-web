import React, { useEffect } from 'react';
import styles from '../../../styles/fourms.module.css';
import FourmRoot from '../../../components/fourm/FourmRoot';
import { FetchTopicById } from '../../../stores/actions/topicActions';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FetchThreadsByTopic } from '../../../stores/actions/threadActions';
import ThreadCard from '../../../components/fourm/ThreadCard';

const TopicPage : React.FC<any> = () => {
    

    const router = useRouter();
    const dispatch = useDispatch();
    
    const { query: { id } } = router;

    const topics = useSelector(state => state.topics.topics.filter((item) => (item["id"] == id)));
    const threads = useSelector(state => state.threadStore.threads.filter((item) => (item["topicId"] == id)));

    const fetchTopic = async () => {
        let res = await FetchTopicById(id, dispatch);

        if(res.error) { 
            console.log(res);
        }
    }

    useEffect(() => {
        FetchThreadsByTopic(id, 0, 20, dispatch);
    }, [id]);

    useEffect(() => {
        if(topics.length == 0) {
            fetchTopic();
        }
    }, [id]);


    return (

        <FourmRoot header={
            topics[0] !== undefined ? (
                <>
                    <div className={styles.topic_header}>
                        <h1 className={styles.header}>{topics[0].title}</h1>
                        <p>{topics[0].description}</p>
                    </div>
                    <div className={styles.thread_create_container}>
                            <button className={styles.thread_create} onClick={() => router.push(`/fourm/topics/${topics[0].id}/new`)}>Start a Thread</button>
                    </div>
                </>
            ) : ""
        }> 
            <div className={styles.fourm_container}>
                <div className={styles.thread_container}>
                    <div className={styles.bar_seporator} ></div>
                    {threads.map((i) => {
                        return <> 
                            <ThreadCard title={i.title} 
                                id={i.id} 
                                uid={i.uid} 
                                createdAt={i.createdAt} 
                                locked={i.locked} 
                                topicId={i.topicId} 
                                posts={i.posts} 
                            /> 
                            <div className={styles.bar_seporator} ></div>
                        </>
                    })}
                </div>
            </div>
        </FourmRoot>
    );
}

export default TopicPage;