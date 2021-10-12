import React, { useState, useEffect } from 'react'
import { EditorState, RichUtils, Modifier } from 'draft-js';
import dynamic from 'next/dynamic';
import Toolbar from './toolbar/Toolbar';
import { stateToHTML } from 'draft-js-export-html';
import createImagePlugin from '@draft-js-plugins/image';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createFocusPlugin from '@draft-js-plugins/focus';
import { composeDecorators } from '@draft-js-plugins/editor';
import MultiFileUploader from '../fourm/MultiFileUploader';
import { BASE_IMAGE_URL } from '../../requests/config';

const Editor = dynamic(import("@draft-js-plugins/editor").then(module => module.default), {
    ssr: false
});

const dragNdDrop = createBlockDndPlugin();
const focusPlugin = createFocusPlugin(); 

const decorator = composeDecorators(
    focusPlugin.decorator,
    dragNdDrop.decorator
);

const imagePlugin = createImagePlugin({ decorator });

const draftEditor: React.FC<{output: Function, hasUploader: boolean, uploads: (uploads: Array<string>) => void, placeholder: string}> = (props) => {

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [attachments, setAttachments] = useState<Array<string>>([]);

    const toggleBlockType = (blockType : string) => {
        let newState = RichUtils.toggleBlockType(editorState, blockType);

        console.log(blockType);
        setEditorState(newState);
    }

    const createContent = () => {
        props.output(stateToHTML(editorState.getCurrentContent()));
    }

    const handleOnChange = editorState_ => { 
        setEditorState(editorState_);
        createContent(); 
    }

    const handleUploadChange = (data) => {
        for(var i of data){
            if(attachments.indexOf(i) !== -1) return;
            setAttachments([...attachments, i]);
            handleOnChange(imagePlugin.addImage(editorState, BASE_IMAGE_URL(i), null));
        }
    } 

    useEffect(() => {
        if(props.uploads) {
            props.uploads(attachments);
        }
    }, [attachments])


    return (
        <div className={"editor_container"}>
            <div className={"editor_button_container"}>
                <Toolbar 
                    onToggle={toggleBlockType}
                    editorState={editorState}
                />
            </div>
            <div className={"editor_spacer"}>
                
                <Editor 
                    placeholder={props.placeholder} 
                    editorState={editorState} 
                    onChange={handleOnChange}
                    plugins={[dragNdDrop, focusPlugin, imagePlugin]}
                />

                {props.hasUploader ? (
                    <MultiFileUploader reccomended_size={"1920x1080 - 20MB"} uploadType={"image"} output={handleUploadChange} custom_classes={["small_file-uploader"]} />
                ): ""}
            </div>
        </div>
    )
}

export default draftEditor;