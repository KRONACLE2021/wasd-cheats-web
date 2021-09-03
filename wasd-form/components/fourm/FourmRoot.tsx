import React from 'react';
import styles from '../../styles/fourms.module.css';

const FourmRoot: React.FC<{header: React.ReactNode}> = (props) => {
    return (
        <div className={styles.main_container}>
            <div className={styles.main_header}>
                {props.header}
            </div>
            <div className={styles.fourm_container}>
                {props.children}    
            </div>
        </div>
    );
} 

export default FourmRoot;