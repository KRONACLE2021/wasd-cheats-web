import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from '../../../../styles/fourms.module.css'
import { useRouter } from 'next/router';

const NewThread: React.FC<any> = (props) => {

    const router = useRouter();


    const editorRef : any = useRef(null);

    const EditorJs = dynamic(() => import('../../../../components/editor/editor-js-rte'), {
        ssr: false
    });

    const { query: { id } } = router;

    const submitForm = async () => {
        let savedData = await editorRef.current.save();

        console.log(savedData);
    }

    console.log(id);
    return (
        <div>
            <div className={styles.editor_container}>
                <div className={styles.main_header}>
                    <h1>Create new thread</h1>
                </div>
                <div className={styles.editor_main_container}>
                    <div>
                        <p>Thread Name</p>
                        <input placeholder={"thread name"} className={styles.editor_input} />
                    </div>
                    <h3>Description: </h3>
                    <p className={styles.editor_details}>For more details on how to fully utilize our editor please check this form post</p>
                    
                    <div className={styles.post_editor}>
                        <EditorJs editorRef={editorRef} ></EditorJs>
                    </div>
                    <div className={styles.top_spacer}></div>
                    <button className={styles.post_thread_btn} onClick={() => submitForm()}>Post Thread</button>
                    <div className={styles.top_spacer}></div>
                </div>
            </div>
        </div>
    );
}

export default NewThread;