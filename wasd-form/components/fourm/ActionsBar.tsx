import React from 'react';
import styles from '../../styles/fourms.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ActionsBar: React.FC<{ actions: Array<{ name: string, fasIcon: any, fasSize: string, eventHandeler: Function, permission: boolean | null }> }> = ({ actions }) => {
    return (
        <div>
            <div className={styles.content_actions}>
                <ul>
                    {actions.map((item) => {
                        if(item.permission !== null && item.permission == true) {
                            return <li onClick={item.eventHandeler}><FontAwesomeIcon size={item.fasSize} icon={item.fasIcon} /> <span className={styles.content_acitons_name}>{item.name}</span></li>
                        }  
                    })}
                </ul>        
            </div>
        </div>
    )
}

export default ActionsBar;