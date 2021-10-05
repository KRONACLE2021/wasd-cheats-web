import React from 'react'
import styles from '../../styles/fourms.module.css';

const ModelContainer: React.FC<any> = (props) => {
    return (
        <div className={`${props.isActive ? styles.model_popup_show : styles.model_popup_hide}`}>
            <div className={styles.model_popup_greyed} onClick={() => props.setModelActive(false)}>
            </div>
            <div className={`${styles.model_popup_container}`} style={{ height: (props.height ? props.height : "auto"), 
            width: (props.width ? props.width : "auto")}}>
                {props.children}
            </div>
        </div>
    )
} 

export default ModelContainer;