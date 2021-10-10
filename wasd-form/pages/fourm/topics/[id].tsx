import React, { useEffect, useState } from 'react';
import styles from '../../../styles/fourms.module.css';
import FourmRoot from '../../../components/fourm/FourmRoot';
import { AdminDeleteTopic, FetchTopicById } from '../../../stores/actions/topicActions';
import { Router, useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FetchThreadsByTopic } from '../../../stores/actions/threadActions';
import ThreadCard from '../../../components/fourm/ThreadCard';
import Paginator from '../../../components/fourm/Paginator';
import Requester from '../../../requests/Requester';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLock, faTrash } from '@fortawesome/free-solid-svg-icons';
import ActionsBar from '../../../components/fourm/ActionsBar';
import ModelContainer from '../../../components/models/ModelContainer';



const TopicPage : React.FC<any> = () => {
    

    const router = useRouter();
    const dispatch = useDispatch();
    
    const { query: { id } } = router;

    const topics = useSelector(state => state.topics.topics.filter((item) => (item["id"] == id)));
    const threads = useSelector(state => state.threadStore.threads.filter((item) => (item["topicId"] == id)));
    const userStore = useSelector(state => state.user.user);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeThreads, setActiveThreads] = useState<Array<any>>([]);
    const [deleteModel, setDeleteModelActive] = useState<boolean>(false);

    let adminActions = [
        {
            name: "Edit",
            fasIcon: faEdit,
            fasSize: "lg",
            eventHandeler: () => {},
            permission: userStore?.permissions?.includes("MODERATOR")
        },
        {
            name: "Lock",
            fasIcon: faLock,
            fasSize: "lg",
            eventHandeler: () => {},
            permission: userStore?.permissions?.includes("MODERATOR")
        },
        {
            name: "Delete",
            fasIcon: faTrash,
            fasSize: "lg",
            eventHandeler: () => {
                setDeleteModelActive(true);
            },
            permission: userStore?.permissions?.includes("MODERATOR")
        },
    ]

    useEffect(() => {
        if(topics.length == 0) {
            dispatch(FetchTopicById(id));
        }

        if(id !== undefined){
            dispatch(FetchThreadsByTopic(id, 0, 20));
        }
    }, [id]);

    useEffect(() => {
        const current = threads.slice((currentPage - 1) * 10, threads.length < 10 ? 10 : threads.length);
        setActiveThreads(current);
    }, [currentPage, threads.length]);

    const pagination = (page : number) => {
        let totalposts = topics[0]?.threads?.length;

        let skipAmount = (page - 1) * 10;
        
        setCurrentPage(page);

        dispatch(FetchThreadsByTopic(id, skipAmount, 20));     
 
    }

    const PaginatorWithVars = <Paginator postsPerPage={10} totalPosts={ topics[0] ? topics[0].threads.length : 0 } maxPaginationNumbers={5} currentPage={currentPage} paginate={pagination} />;
 
    const deleteTopic = () => {
        if(userStore.api_key && id){
            dispatch(AdminDeleteTopic(id, userStore.api_key));
            router.push("/fourm");
        }
    }
   

    return (

        <FourmRoot header={
            topics[0] !== undefined ? (
                <>
                    <div className={styles.topic_header}>
                        <h1 className={styles.header}>{topics[0].title}</h1>
                        <p style={{ marginBottom: "0px"}}>{topics[0].description}</p>

                        {userStore?.permissions?.includes("MODERATOR") ? <> 
                            <div className={styles.fourm_header_actions_bar_container}>
                                <ActionsBar actions={adminActions}></ActionsBar> 
                            </div>
                        </> : "" }
                    </div>
                    <div className={styles.thread_create_container}>
                            <button className={styles.thread_create} onClick={() => router.push(`/fourm/topics/${topics[0].id}/new`)}>Start a Thread</button>
                    </div>
                </>
            ) : ""
        }> 
            <ModelContainer isActive={deleteModel}  setModelActive={setDeleteModelActive} key={"DeleteTopicPopup"}>
                    <div style={{ padding: "10px 25px"}}>
                        <h2>Delete this topic?</h2>
                        <p style={{fontWeight: "bolder"}}>Deleting this topic will delete all content under it! Are you sure you want to delete it?</p>
                    </div>
                    <div className={styles.delete_button_container}>
                        <button className={styles.delete_button} onClick={() => setDeleteModelActive(false)}>Cancel</button>
                        <button className={`${styles.delete_button} ${styles.delete_button_red}`} onClick={() => deleteTopic()}>Delete Topic</button>
                    </div>
            </ModelContainer>
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
                    {activeThreads.length == 0 ? (
                        <div style={{ textAlign: "center"}}>
                            <h3>Things are empty in here..</h3>
                            <p>Make a new thread to get started!</p>
                        </div>
                    ) : ""}
                    <div className={styles.top_spacer}></div>
                    {PaginatorWithVars}
                </div>
            </div>
        </FourmRoot>
    );
}

export default TopicPage;