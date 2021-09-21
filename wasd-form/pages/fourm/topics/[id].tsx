import React, { useEffect, useState } from 'react';
import styles from '../../../styles/fourms.module.css';
import FourmRoot from '../../../components/fourm/FourmRoot';
import { FetchTopicById } from '../../../stores/actions/topicActions';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FetchThreadsByTopic } from '../../../stores/actions/threadActions';
import ThreadCard from '../../../components/fourm/ThreadCard';
import Paginator from '../../../components/fourm/Paginator';
import Requester from '../../../requests/Requester';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLock, faTrash } from '@fortawesome/free-solid-svg-icons';



const TopicPage : React.FC<any> = () => {
    

    const router = useRouter();
    const dispatch = useDispatch();
    
    const { query: { id } } = router;

    const topics = useSelector(state => state.topics.topics.filter((item) => (item["id"] == id)));
    const threads = useSelector(state => state.threadStore.threads.filter((item) => (item["topicId"] == id)));

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeThreads, setActiveThreads] = useState<Array<any>>([]);

    let adminActions = [
        {
            name: "Edit",
            fasIcon: faEdit,
            fasSize: "lg",
            eventHandeler: () => {}
        },
        {
            name: "Lock",
            fasIcon: faLock,
            fasSize: "lg",
            eventHandeler: () => {}
        },
        {
            name: "Delete",
            fasIcon: faTrash,
            fasSize: "lg",
            eventHandeler: () => {}
        },
    ]

    const fetchTopic = async () => {
        let res = await FetchTopicById(id, dispatch);

        if(res.error) { 
            console.log(res);
        }
    }

    useEffect(() => {
        requestTopics(0, 10);
    }, [id]);


    useEffect(() => {
        if(topics.length == 0) {
            fetchTopic();
        }
    }, [id]);

    const requestTopics = async (skip: number, limit: number) => {
        let result = await FetchThreadsByTopic(id, skip, limit, dispatch);

        setActiveThreads(result.threads);
    }

    const pagination = (page : number) => {
        let totalposts = topics[0]?.threads?.length;

        let skipAmount =  (page - 1) * 10;
        
        setCurrentPage(page);

        requestTopics(skipAmount, 10);
    }

    const PaginatorWithVars = <Paginator postsPerPage={10} totalPosts={ topics[0] ? topics[0].threads.length : 0 } maxPaginationNumbers={5} currentPage={currentPage} paginate={pagination} />;

    return (

        <FourmRoot header={
            topics[0] !== undefined ? (
                <>
                    <div className={styles.topic_header}>
                        <h1 className={styles.header}>{topics[0].title}</h1>
                        <p>{topics[0].description}</p>

                        <div className={styles.content_actions}>
                            <ul>
                                {adminActions.map((item) => {
                                    return <li onClick={item.eventHandeler}><FontAwesomeIcon size={item.fasSize} icon={item.fasIcon} /> <span className={styles.content_acitons_name}>{item.name}</span></li>
                                })}
                            </ul>

                        </div>
                    </div>
                    <div className={styles.thread_create_container}>
                            <button className={styles.thread_create} onClick={() => router.push(`/fourm/topics/${topics[0].id}/new`)}>Start a Thread</button>
                    </div>
                </>
            ) : ""
        }> 
            <div className={styles.fourm_container}>
                <div className={styles.thread_container}>
                    {PaginatorWithVars}
                    <div className={styles.top_spacer}></div>
                    <div className={styles.bar_seporator} ></div>
                    {activeThreads ? activeThreads.map((i) => {
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
                    }) : ""}
                    <div className={styles.top_spacer}></div>
                    {PaginatorWithVars}
                </div>
            </div>
        </FourmRoot>
    );
}

export default TopicPage;