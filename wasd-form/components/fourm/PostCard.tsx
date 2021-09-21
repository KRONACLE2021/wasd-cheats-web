import React, { useState, useEffect } from 'react'
import DOMPurify from 'dompurify';
import getAvatar from '../../utils/getAvatar';
import styles from '../../styles/fourms.module.css';
import fetchUser from '../../requests/getUser';
import { IUser } from '../../interfaces';
import { SetPostUser, DeletePost } from '../../stores/actions/postsAction';
import { useDispatch, useSelector } from 'react-redux';
import getUserPermission from '../../utils/getUserPermission';
import { QuoteUser, SetEditorFocused } from '../../stores/actions/textEditorActions';
import ModelContainer from '../models/ModelContainer';

const PostCard: React.FC<{ contents: string, uid: string, createdAt: string, id: string, attachments: Array<string>, user: IUser | null, replyToPost: Function}> = (props) => {

    const [contents, setContents] = useState<string | null>(null);
    const [deleteModelActive, setDeleteModelActive] = useState(false);
    const userStore = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        var santiziedHtml = DOMPurify.sanitize(props.contents);

        setContents(santiziedHtml);
    }, [props.contents]);


    useEffect(async () => {
        
        if(props.uid){
            let res = await fetchUser(props.uid);
            
            dispatch(SetPostUser(props.id, res));
        }
    }, [props.uid]);

    const ReplyToPost = () => {
        dispatch(QuoteUser(props.id));
        dispatch(SetEditorFocused(true));
    }

    const deletePost = async () => {
        if(!userStore.api_key) return;

        const res = await DeletePost(props.id, userStore.api_key, dispatch);
        
        if(res?.error){
            console.log(res.error);
        } else {
            setDeleteModelActive(false);
        }
    }

    return (
        <>
            {userStore?.permissions?.includes("MODERATOR") ? (
                <ModelContainer isActive={deleteModelActive} width={"500px"} height={"auto"} setModelActive={setDeleteModelActive}>
                    <div style={{ padding: "10px 25px"}}>
                        <h2>Delete this post?</h2>
                        <p style={{fontWeight: "bolder"}}>You cannot undelete a post! Once its deleted its gone, are you really sure you want to delete this?</p>
                    </div>
                    <div className={styles.delete_button_container}>
                        <button className={styles.delete_button} onClick={() => setDeleteModelActive(false)}>Cancel</button>
                        <button className={`${styles.delete_button} ${styles.delete_button_red}`} onClick={() => deletePost()}>Delete post</button>
                    </div>
                </ModelContainer>
            ) : ""}

            <div className={styles.fourm_post_container}>
                    <div className={styles.post_user_container}>
                        <img src={props.user?.avatar} className={styles.pfp} />
                        <h3 className={styles.username}>{props.user?.username}</h3>
                        <p className={styles.permission_type}>{props?.user?.permissions ? getUserPermission(props?.user?.permissions) : ""}</p>
                    </div>
                    <div className={styles.post_content}>
                    <div dangerouslySetInnerHTML={{ __html: contents }}></div>
                    
                    <div className={styles.content_actions}>
                            <ul>
                                <li onClick={() => ReplyToPost()}><img src={"/reply-all.png"} alt={"reply"} /></li>
                                <li><img src={"/warning.png"} alt={"report"} /></li>
                                
                                {userStore?.permissions?.includes("MODERATOR") ? (
                                    <li onClick={() => setDeleteModelActive(true)}><img src={"/delete.png"} alt={"delete"}/></li>
                                ) : ""}        
                            </ul>

                        </div>
                    </div>
            </div>
        </>
    )
} 

export default PostCard;