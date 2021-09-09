import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styles from '../../../../styles/fourms.module.css';
import { CreateThread } from '../../../../stores/actions/threadActions';
import { Router, useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Draft from '../../../../components/editor/draft';
import Preloader from '../../../../components/shared/Preloader';
import FourmError from '../../../../components/shared/FourmError';


const NewThread: React.FC<any> = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const router = useRouter();

    const { query: { id } } = router;

    const [title, setTitle] = useState<string>("");
    const [htmlPost, setHtmlPost] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<Array<String>>([]);


    const submitForm = async () => {
        let response = await CreateThread({title, post: htmlPost, attachments: null, topic_id: id }, user.api_key, dispatch);

        if(!response.error){
            router.push(`/fourm/posts/${response.id}`);
        } else {
            setErrors(response.errors);
        }
    }

    useEffect(() => {
        if(!user.username){
            router.push("/login");
        } else {
            setLoading(false);
        }

    }, [user]);

    if(loading == true) return <Preloader />;

    return (
        <div>
            <div className={styles.editor_container}>
                <div className={styles.main_header}>
                    <h1>Create new thread</h1>
                    { errors.length !== 0 ? <> 
                        <FourmError error={"Error!"} errorDescription={errors[0]} />     
                        <div className={styles.top_spacer}></div>               
                    </> : ""
                    }

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