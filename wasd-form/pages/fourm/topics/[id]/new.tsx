import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styles from '../../../../styles/fourms.module.css';
import { CreateThread } from '../../../../stores/actions/threadReducer';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Draft from '../../../../components/editor/draft';


const NewThread: React.FC<any> = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const router = useRouter();

    const { query: { id } } = router;

    const [title, setTitle] = useState<string>("");
    const [htmlPost, setHtmlPost] = useState<string>("");

    const submitForm = async () => {
        CreateThread({title, post: htmlPost, attachments: null, topic_id: id }, user.api_key, dispatch);
    }
    
    return (
        <div>
            <div className={styles.editor_container}>
                <div className={styles.main_header}>
                    <h1>Create new thread</h1>
                </div>
                <div className={styles.editor_main_container}>
                    <div>
                        <p>Thread Name</p>
                        <input placeholder={"thread name"} onChange={(e) => setTitle(e.target.value)} className={styles.editor_input} />
                    </div>
                    <h3>Description: </h3>
                    <p className={styles.editor_details}>For more details on how to fully utilize our editor please check this form post</p>
                    
                    <Draft output={setHtmlPost} />
                    <div className={styles.top_spacer}></div>
                    <button className={styles.post_thread_btn} onClick={() => submitForm()}>Post Thread</button>
                    <div className={styles.top_spacer}></div>
                </div>
            </div>
        </div>
    );
}

export default NewThread;