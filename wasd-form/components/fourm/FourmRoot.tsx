import React from 'react';
import styles from '../../styles/fourms.module.css';

const FourmRoot: React.FC<{header: React.ReactNode}> = (props) => {
    return (
        <div className={`${styles.main_container}`}>
                <div className={styles.fourm_master_header}>
                    <div className={styles.fourm_master_header_logos}>
                        <h1>WASD</h1>
                        <p>Community Fourms</p>
                    </div>
                </div>
                <div className={styles.fourm_main_cotent}>
                    <div className={`${styles.main_header}`}>
                        {props.header}
                    </div>
                    <div>
                        <div className={`${styles.fourm_container}`}>
                            <div className={styles.fourm_content}>
                                {props.children}   
                            </div> 
                        </div> 
                    </div>
                </div>
        </div>
    );
} 

export default FourmRoot;