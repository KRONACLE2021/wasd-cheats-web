import React, { useEffect } from 'react';
import styles from '../../styles/fourms.module.css';
import { FetchTopicsByCategory } from '../../stores/actions/topicActions';
import { useDispatch, useSelector } from 'react-redux';
import TopicCard from './TopicCard';

const CategoryContainer: React.FC<{name: string, id: string, isAdmin: any, toggleAddModel: any}> = (props) => {

    const dispatch = useDispatch();
    const topics = useSelector(state => state.topics.topics);

    useEffect(() => {
        FetchTopicsByCategory(props.id, dispatch);
    }, [])

    return (
        <div className={styles.category_container}>
            <div className={`${styles.category_top_header}`}>
                <h1 className={styles.category_header}>{props.name}</h1>
                {props.isAdmin ? (
                    <button className={styles.add_topic_btn} onClick={() => props.toggleAddModel(true)}>Add Topic</button>
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
    );
}

export default CategoryContainer;