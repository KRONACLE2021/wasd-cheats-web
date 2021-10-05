import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styles from '../../styles/fourms.module.css';

const Dropdown: React.FC<{ choices: Array<string>, default_state: string | null }> = ({ choices, default_state }) => {
    
    const [currentSelection, setSelection] = useState(default_state ? default_state : "<Select one>");
    const [dropdownActive, setDropdownActive] = useState(false);

    return (
        <div className={styles.default_dropdown}  onMouseLeave={() => setDropdownActive(false)} onMouseEnter={() => setDropdownActive(true)}>
            <div className={styles.default_dropdown_selected}>
                <p className={styles.dropdown_currentSelection}>{currentSelection}</p>
                <FontAwesomeIcon icon={faArrowDown}></FontAwesomeIcon>
            </div>
            <div style={{ display: dropdownActive ? "block" : "none"}} className={styles.default_dropdown_selections}>
                <ul>
                    {choices.map(i => {
                        return <li onClick={() => setSelection(i)}>{i}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Dropdown;