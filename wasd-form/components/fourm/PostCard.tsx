import React, { useState, useEffect } from 'react'
import DOMPurify from 'dompurify';
import getAvatar from '../../utils/getAvatar';
import styles from '../../styles/fourms.module.css';
import fetchUser from '../../requests/getUser';
import { IUser } from '../../interfaces';
import { SetPostUser } from '../../stores/actions/postsAction';
import { useDispatch, useSelector } from 'react-redux';
import getUserPermission from '../../utils/getUserPermission';

const PostCard: React.FC<{ contents: string, uid: string, createdAt: string, id: string, attachments: Array<string>, user: IUser | null }> = (props) => {

    const [contents, setContents] = useState<string | null>(null);
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

    return (
        <div className={styles.fourm_post_container}>
                <div className={styles.post_user_container}>
                    <img src={props.user?.avatar} className={styles.pfp} />
                    <h3 className={styles.username}>{props.user?.username}</h3>
                    <p className={styles.permission_type}>{props?.user?.permissions ? getUserPermission(props?.user?.permissions) : ""}</p>
                </div>
                <div className={styles.post_content}>
                   <div dangerouslySetInnerHTML={{ __html: contents }}></div>
                   
                   <div className={styles.post_actions}>
                        <ul>
                            <li><img src={"/reply-all.png"} alt={"reply"} /></li>
                            <li><img src={"/warning.png"} alt={"report"} /></li>
                            
                            {userStore?.permissions?.includes("MODERATOR") ? (
                                <li><img src={"/delete.png"} alt={"delete"}/></li>
                            ) : ""}        
                        </ul>

                    </div>
                </div>
        

        </div>
    )
} 

export default PostCard;