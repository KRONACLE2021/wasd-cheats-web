import React, { useEffect, useState } from 'react';
import styles from '../../styles/fourms.module.css';
import { FetchTopicsByCategory } from '../../stores/actions/topicActions';
import { useDispatch, useSelector } from 'react-redux';
import TopicCard from './TopicCard';
import ModelContainer from '../models/ModelContainer';
import FileUploader from './FileUploader';

const CategoryContainer: React.FC<{name: string, id: string, isAdmin: any, toggleAddModel: any}> = (props) => {

    const dispatch = useDispatch();
    const [modelIsActive, setModelActive] = useState<boolean>(false);
    const [topicCreateData, setTopicCreateData] = useState({});
    const topics = useSelector(state => state.topics.topics);

    useEffect(() => {
        FetchTopicsByCategory(props.id, dispatch);
    }, []);

    const adminCreateTopic = () => {

    }

    return (
        <>
            <ModelContainer isActive={modelIsActive} setModelActive={setModelActive}>
                <h1>Create a new topic</h1>
                <div>
                    <div>
                        <p>Topic name</p>
                        <input className={styles.input} placeholder={"Topic Name"} onChange={(e) => setTopicCreateData({...topicCreateData, name: e.target.value})}></input>
                    </div>
                    <div>
                        <p>Topic description</p>
                        <input className={styles.input} placeholder={"Topic Description"} onChange={(e) => setTopicCreateData({...topicCreateData, description: e.target.value})}></input>
                    </div>
                    
                    <div className={styles.top_spacer}></div>
                    <FileUploader reccomended_size={"50x50"} uploadType={"icon"} />
                    <button className={styles.add_topic_btn} onClick={() => adminCreateTopic}>Create Topic</button>
                    <div className={styles.top_spacer}></div>
                </div>
            </ModelContainer>
            <div className={styles.category_container}>
                <div className={`${styles.category_top_header}`}>
                    <h1 className={styles.category_header}>{props.name}</h1>
                    {props.isAdmin ? (
                        <button className={styles.add_topic_btn} onClick={() => setModelActive(true)}>Add Topic</button>
                    ) : ""}
                </div>

                <div className={styles.bar_seporator}></div>

                <div className={styles.category_topics_container}>
                    {props.children}
                    {topics !== [] ? topics.map((t) => {
                        if(t.category == props.id) {
                            return <TopicCard   title={t.title}
                                                description={t.description}
                                                imgUrl={t.imgUrl}
                                                id={t.id}
                                    />
                        }
                    }) : "" }
                </div>
            </div>
        </>
    );
}

export default CategoryContainer;