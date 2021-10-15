import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import styles from '../../styles/admin.module.css';

const MultiSelector: React.FC<{ choices: Array<string>; selected: Array<string>; output: (data: Array<String>) => void }> = ({ output, choices, selected }) => {
    
    const [selectedTags, setSelectedTags] = useState<Array<string>>(selected ? selected : []);
    const [allTags, setAllTags] = useState<Array<string>>(choices);

    useEffect(() => {
        setAllTags(choices);
    }, [choices]);

    useEffect(() => {
        allTags.forEach(i => {
            console.log(i, selectedTags.indexOf(i));
            if(selectedTags.indexOf(i) !== -1) {
                setAllTags(allTags.splice(selectedTags.indexOf(i), 1));
            }
        })

        output(selectedTags);
    }, [allTags, selectedTags]);

    const addSelectedTag = (index: number) => {
        if(!allTags[index]) return;

        setSelectedTags([...selectedTags, allTags[index]]);

        setAllTags(allTags.filter((i, index_) => index_ !== index));

    } 

    const deselectTag = (index: number) => {
        if(!selectedTags[index]) return;

        console.log("deselecting")

        let tag = selectedTags[index];
        
        setSelectedTags(selectedTags.filter((i, index_) => index_ !== index));

        setAllTags([...allTags, tag]);
    }

    return (
        <div className={styles.multiselector_container}>
            <div className={styles.multiselector_selected}>
                <p>Selected tags</p>
                {selectedTags.map((i: any, index: number) => {
                    return <div className={styles.multiselector_select_bubble}>
                        <p>{i} <span onClick={() => deselectTag(index)}><FontAwesomeIcon icon={faTimes} /></span></p>
                    </div>
                })}
            </div>
            <div className={styles.multiselector_unselected}>
                <p>Deselected tags</p>
                {allTags.map((i: any, index: number) => {
                    return <div onClick={() => addSelectedTag(index)}className={styles.multiselector_select_bubble}>
                        <p>{i} <FontAwesomeIcon icon={faTimes} /></p>
                    </div>
                })}
            </div>
        </div>
    )
}

export default MultiSelector;