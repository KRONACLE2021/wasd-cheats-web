import React from 'react'
import styles from '../../styles/fourms.module.css';

const ModelContainer: React.FC<any> = (props) => {
    return (
        <div  style={{display: props.isActive ? "block" : "none"}}>
            <div className={styles.model_popup_greyed} onClick={() => props.setModelActive(false)}>
            </div>
            <div className={styles.model_popup_container}>
                {props.children}
            </div>
        </div>
    )
} 

export default ModelContainer;