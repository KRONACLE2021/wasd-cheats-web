import React from 'react'
import styles from '../../styles/fourms.module.css';

const ModelContainer: React.FC<any> = (props) => {
    return (
        <div className={styles.model_popup_greyed}>
            <div className={styles.model_popup_container}>
                {props.children}
            </div>
        </div>

    )
} 

export default ModelContainer;