import React, { useEffect, useState } from 'react';
import styles from '../../styles/fourms.module.css';
import { CreateTopic, FetchTopicsByCategory } from '../../stores/actions/topicActions';
import { useDispatch, useSelector } from 'react-redux';
import TopicCard from './TopicCard';
import ModelContainer from '../models/ModelContainer';
import FileUploader from './FileUploader';
import { BASE_IMAGE_URL } from '../../requests/config';
import FourmError from '../shared/FourmError';

const CategoryContainer: React.FC<{name: string, id: string, isAdmin: any, toggleAddModel: any}> = (props) => {

    const dispatch = useDispatch();
    const [modelIsActive, setModelActive] = useState<boolean>(false);
    const [topicCreateData, setTopicCreateData] = useState<{ category: string; attachmentId: string; title: string; description: string; }>({ category: props.id, title: "", description: "", attachmentId: "" });
    const topics = useSelector((state : any) => state.topics.topics.filter((i: any) => i.category == props.id));
    const userStore = useSelector((state : any) =>  state.user.user);
    const [modelError, setModelError] = useState("");

    useEffect(() => {
        FetchTopicsByCategory(props.id, dispatch);
    }, []);

    const adminCreateTopic = () => {
        if(userStore.api_key){
            setModelError("");
            if(topicCreateData.title == "" || !topicCreateData.title) return setModelError("Please provide a name for the topic you want to create!");
            if(topicCreateData.description == "" || !topicCreateData.description) return setModelError("Please provide a description for the topic you want to create!");
            if(topicCreateData.attachmentId == "" || !topicCreateData.attachmentId) return setModelError("Please upload an icon for the topic!");
            if(topicCreateData.category == "" || !topicCreateData.category) return setModelError("Could not be attached to a category! Please reload the page.  ");

            dispatch(CreateTopic(topicCreateData, userStore.api_key));
            setModelActive(false);
        }
    }

    return (
        <>
            <ModelContainer isActive={modelIsActive} setModelActive={setModelActive}>
                <div className={styles.topic_create_model}>
                    <h1>Create a new topic</h1>
                    {modelError !== "" ? <FourmError error={"Error!"} errorDescription={modelError} /> : "" }
                    <div>
                        <div>
                            <p>Topic name</p>
                            <input className={styles.input} placeholder={"Topic Name"} onChange={(e) => setTopicCreateData({...topicCreateData, title: e.target.value})}></input>
                        </div>
                        <div>
                            <p>Topic description</p>
                            <input className={styles.input} placeholder={"Topic Description"} onChange={(e) => setTopicCreateData({...topicCreateData, description: e.target.value})}></input>
                        </div>
                        
                        <div className={styles.top_spacer}></div>
                        <FileUploader reccomended_size={"50x50"} uploadType={"icon"} output={(attachmentId: string) => {setTopicCreateData({ ...topicCreateData, attachmentId: attachmentId})}} />
                        <button className={styles.add_topic_btn} onClick={() => adminCreateTopic()}>Create Topic</button>
                        <div className={styles.top_spacer}></div>
                    </div>
                </div>
            </ModelContainer>
            <div className={styles.category_container}>
                <div className={`${styles.category_top_header}`}>
                    <h1 className={styles.category_header}>{props.name}</h1>
                    {props.isAdmin ? (
                        <div className={styles.topic_actions_container}>
                            <button className={styles.add_topic_btn} onClick={() => setModelActive(true)}>Add Topic</button>
                        </div>
                    ) : ""}
                </div>
    

                <div className={styles.category_topics_container}>
                    {props.children}
                    {topics !== [] ? topics.map((t: any) => {
                        if(t.category == props.id) {
                            return <TopicCard   title={t.title}
                                                description={t.description}
                                                imgUrl={BASE_IMAGE_URL(t.imgID)}
                                                id={t.id}
                                                threadAmount={t.threads.length}
                                    />
                        }
                    }) : "" }

                    {topics.length == 0 ? <div style={{ textAlign: "center"}}> 
                        <h1>Things are empty in here..</h1> 
                        <p>Try adding a topic to start some conversations!</p>
                    </div> : ""}
                    <div className={styles.spacer}></div>
                </div>
            </div>
        </>
    );
}

export default CategoryContainer;