import React, { useState, useEffect } from 'react'
import DOMPurify from 'dompurify';
import getAvatar from '../../utils/getAvatar';
import styles from '../../styles/fourms.module.css';
import fetchUser from '../../requests/getUser';
import { IUser } from '../../interfaces';
import { SetPostUser, DeletePost } from '../../stores/actions/postsAction';
import { useDispatch, useSelector } from 'react-redux';
import getUserPermission, { getPermissionColor } from '../../utils/getUserPermission';
import { QuoteUser, SetEditorFocused } from '../../stores/actions/textEditorActions';
import ModelContainer from '../models/ModelContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import ActionsBar from './ActionsBar';
import ReportModel from '../shared/ReportModel';
import Link from 'next/dist/client/link';


const PostCard: React.FC<{ contents: string, uid: string | null, createdAt: string, id: string, attachments: Array<string>, user: IUser | null, replyToPost: Function, thread: any}> = (props) => {

    const [contents, setContents] = useState<string | null>(null);
    const [deleteModelActive, setDeleteModelActive] = useState(false);
    const [reportModelActive, setReportModelActive] = useState(false);
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
        if(!userStore.user.api_key) return;

        const res = await DeletePost(props.id, userStore.user.api_key, dispatch);
        
        if(res?.error){
            console.log(res.error);
        } else {
            setDeleteModelActive(false);
        }
    }


    let userActions = [
        /* {
            name: "Edit",
            fasIcon: faEdit,
            fasSize: "lg",
            eventHandeler: () => {},
             permission: props.uid == userStore.user.uid
        }, */
        {
            name: "Report",
            fasIcon: faExclamationTriangle,
            fasSize: "lg",
            eventHandeler: () => {
                setReportModelActive(true);
            },
            permission: true
        },
        {
            name: "Delete",
            fasIcon: faTrash,
            fasSize: "lg",
            eventHandeler: () => setDeleteModelActive(true),
            permission: props.uid == userStore.user.uid || userStore?.user?.permissions?.includes("MODERATOR")
        },
    ]

    return (
        <>
            <ReportModel 
                content_type={"POST"}
                content_id={props.id}
                modelActive={reportModelActive}
                setModelActive={setReportModelActive}
            />

            {userStore?.permissions?.includes("MODERATOR") || props.uid == userStore.user.uid ? (
                <ModelContainer isActive={deleteModelActive} width={"500px"} height={"auto"} setModelActive={setDeleteModelActive}>
                    <div style={{ padding: "10px 25px"}}>
                        <h2>Delete this post?</h2>
                        <p style={{fontWeight: "bolder"}}>{props.thread?.posts?.length() == 1 ? "You cannot undelete a post! Once its deleted its gone, are you really sure you want to delete this?" : "Since this is the last post in the thread, if you delete this the thread will be deleted. Are you sure you want to delete this?"}</p>
                    </div>
                    <div className={styles.delete_button_container}>
                        <button className={styles.delete_button} onClick={() => setDeleteModelActive(false)}>Cancel</button>
                        <button className={`${styles.delete_button} ${styles.delete_button_red}`} onClick={() => deletePost()}>Delete post</button>
                    </div>
                </ModelContainer>
            ) : ""}

            <div className={styles.fourm_post_container}>
                    <div className={styles.post_user_container}>
                        <img src={getAvatar(props.user)} className={styles.pfp} />
                        <Link href={`/users/${props.user?.uid}`}><h3 className={styles.username}>{props.user?.username}</h3></Link>
                        <p className={`${styles.permission_type} ${getPermissionColor(props?.user?.permissions)} `}>{props?.user?.permissions ? getUserPermission(props?.user?.permissions) : ""}</p>
                    </div>
                    <div className={styles.post_content}>
                    <div dangerouslySetInnerHTML={{ __html: contents }} className={styles.fourm_post_contents}></div>
                        
                       <ActionsBar actions={userActions} />
                    </div>
            </div>
        </>
    )
} 

export default PostCard;