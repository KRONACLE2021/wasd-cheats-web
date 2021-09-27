import Router from 'next/router';
import React, { useState, useEffect } from 'react';
import { IUser } from '../../interfaces';
import { CreatePost } from '../../stores/actions/postsAction';
import styles from '../../styles/fourms.module.css';
import getAvatar from '../../utils/getAvatar';
import { useDispatch, useSelector } from 'react-redux';
import Draft from '../editor/draft';
import FourmError from '../shared/FourmError';

const ReplyContainer: React.FC<{user: any, topic_id: string}> = ({ user, topic_id }) => {
    
    const [editorIsActive, setActiveEditor] = useState<boolean>(false);
    const [editorOutput, setEditorOutput] = useState<string>("");
    const [fillerText, setFillerText] = useState<string>("Sign in to reply!");
    const [error, setErrors] = useState<Array<string>>([]);
    const dispatch = useDispatch();

    const editorState = useSelector(state => state.editorStore); 

    useEffect(() => {
        if(user.user.uid){
            setFillerText("Reply to this conversation.");
        }
    }, [user.loading]);

    useEffect(() => {
        if(editorState.replying_to.length !== 0){

        }
    }, [editorState.replying_to])

    useEffect(() => {
        setActiveEditor(editorState.isFocused);
    }, [editorState.isFocused])

    const spawnEditor = () => {

        console.log(user);
        if(!user.uid) {
            Router.push("/login");
        }

        setActiveEditor(true);
    }

    const createPost_ = async () => {

        if(!user.uid){
            Router.push("/login");
        }

        let res = await CreatePost(editorOutput, [], topic_id, user.api_key, dispatch);

        if(res.error){
            setErrors(res.errors);
        } else {
            setActiveEditor(false);
        }
        
    }

    
    return (
        <div className={`${styles.reply_continer} ${editorIsActive ? styles.editor_active : ""}`}>
            <div className={styles.reply_user_pfp_contianer}>
                <img src={getAvatar(user)} />
            </div>
            {editorIsActive == false ? <div onClick={() => spawnEditor()} className={styles.reply_placeholder}>
                <p>{fillerText}</p>
            </div> : ( 
                <div style={{width: "100%"}}>
                    { error.length !== 0 ? <FourmError error={"Error!"} errorDescription={error[0]} /> : "" }
                    <div className={styles.reply_draft_editor}> <Draft  output={setEditorOutput} /> </div> 
                    <div className={styles.top_spacer}></div>
                    <button className={styles.post_thread_btn} onClick={() => createPost_()}>Post</button>
                </div>
            )} 
        </div>
    )
};

export default ReplyContainer;