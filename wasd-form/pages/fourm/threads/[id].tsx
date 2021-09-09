import React, { useEffect, useState } from 'react';
import FourmRoot from '../../../components/fourm/FourmRoot';
import styles from '../../../styles/fourms.module.css';
import axios from 'axios';
import getAvatar from '../../../utils/getAvatar';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FetchThreadById, SetOwner } from '../../../stores/actions/threadActions';
import { API, FETCH_USER } from '../../../requests/config';
import { FetchPostsByThreadId } from '../../../stores/actions/postsAction';
import PostCard from '../../../components/fourm/PostCard';
import Preloader from '../../../components/shared/Preloader';
import FullPageError from '../../../components/shared/FullpageError';
import Draft from '../../../components/editor/draft';

const ThreadPage: React.FC<any> = (props) => {
    
    const router = useRouter();
    const dispatch = useDispatch();

    const { query: { id } } = router;

    const userStore = useSelector(store => store.user);
    const thread = useSelector(store => store.threadStore.threads.filter((item) => (item["id"] == id)));
    const posts = useSelector(store => store.postStore.posts.filter((i) => (i["threadId"] == id)));
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [editorIsActive, setActiveEditor] = useState<boolean>(false);
    const [editorOutput, setEditorOutput] = useState("");

    const fetchUser = async (uid: string) => {
        let response = await axios.get(`${API}/${FETCH_USER(uid)}`)
        .then((res) => res)
        .catch((err) => err.response);

        let data = response?.data;

        if(!data.error && data !== undefined){
            dispatch(SetOwner(id, data));
        }

        if(!data) {
            console.log("uwu");
            setError("Could not contact API");
        }
    }

    useEffect(() => {
        if(thread[0]){
            if(thread[0].user == null){
                fetchUser(thread[0].uid);
                //we can assume that the thread was found
            }

            FetchPostsByThreadId(id, 20, 0, dispatch);

            setLoading(false);
        }
    }, [id, thread[0]]);

    useEffect(async () => {
        if(id){
            let res = await FetchThreadById(id, dispatch);

            if(res.error) { 
                setError(res.errors) 
                setLoading(false);
            };
        }
    }, [id]);


    const createPost = async () => {
      
    }


    const spawnEditor = () => {
        setActiveEditor(true);
    }

    if(loading == true && error !== null) return <Preloader />;

    if(error !== null) return <FullPageError error={error} code={500} />;

    return (
        <FourmRoot
        header={<>
            <div className={styles.topic_header}>
                <h1 className={styles.header}>{thread[0]?.title}</h1>
                <div className={styles.topic_creator_info}>
                    <img className={styles.user_avatar} src={getAvatar(thread[0]?.user)} />
                     <div className={styles.user_info}>
                        <p className={styles.username}>By {thread[0]?.user?.username}</p>
                        <p>Created at {thread[0]?.createdAt}</p>
                     </div>
                </div>
            </div>
        </>}>
        {posts.map((i) => { 
            return <PostCard    key={i.id} 
                                id={i.id}
                                contents={i.contents} 
                                uid={i.uid}
                                user={i.user}
                                createdAt={i.createdAt}
                                attachments={i.attachments} 
                    /> 
        })}
        <div className={`${styles.reply_continer} ${editorIsActive ? styles.editor_active : ""}`}>
            <div className={styles.reply_user_pfp_contianer}>
                <img src={getAvatar(userStore)} />
            </div>
            {editorIsActive == false ? <div onClick={() => spawnEditor()} className={styles.reply_placeholder}>
                <p>Reply to this topic!</p>
            </div> : ( 
                <div style={{width: "100%"}}>
                    <div className={styles.reply_draft_editor}> <Draft output={setEditorOutput} /> </div> 
                    <div className={styles.top_spacer}></div>
                    <button className={styles.post_thread_btn}>Post</button>
                </div>
            )} 
        </div>
        </FourmRoot>
    )
}

export default ThreadPage;