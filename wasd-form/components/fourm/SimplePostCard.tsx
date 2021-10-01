import React, { useEffect, useState } from 'react'
import styles from '../../styles/fourms.module.css';
import ActionsBar from './ActionsBar';
import getUserPermission, { getPermissionColor } from '../../utils/getUserPermission';
import DOMPurify from 'dompurify';

const SimplePostCard: React.FC<{ id: string, contents: string, postOwner: any, createdAt: string, attachments: any }> = (props) => {

    const [contents, setContents] = useState<string | null>(null);

    useEffect(() => {
        var santiziedHtml = DOMPurify.sanitize(props.contents);

        setContents(santiziedHtml);
    }, [props.contents]);

    return (
        <div className={styles.user_post_cards}>
            <div className={styles.fourm_post_container}>
                    <div className={styles.post_user_container}>
                        <img src={props.postOwner?.avatar} className={styles.pfp} />
                        <h3 className={styles.username}>{props.postOwner?.username}</h3>
                        <p className={`${getPermissionColor(props?.postOwner?.permissions)} ${styles.permission_type}`}>{props?.postOwner?.permissions ? getUserPermission(props?.postOwner?.permissions) : ""}</p>
                    </div>
                    <div className={styles.post_content}>
                    <div dangerouslySetInnerHTML={{ __html: contents }}></div>
                       {/* <ActionsBar actions={userActions} /> */}
                    </div>
            </div>
        </div>
    )
}

export default SimplePostCard;
