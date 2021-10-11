import React, { useState } from 'react'
import { EditorState, RichUtils, Modifier } from 'draft-js';
import dynamic from 'next/dynamic';
import Toolbar from './toolbar/Toolbar';
import { stateToHTML } from 'draft-js-export-html';
import createImagePlugin from '@draft-js-plugins/image';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createFocusPlugin from '@draft-js-plugins/focus';
import { composeDecorators } from '@draft-js-plugins/editor';

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

const draftEditor: React.FC<{output: Function, placeholder: string}> = (props) => {

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    
    const toggleBlockType = (blockType : string) => {
        let newState = RichUtils.toggleBlockType(editorState, blockType);

        console.log(blockType);
        setEditorState(newState);
    }

    const createContent = () => {
        //props.output(stateToHTML(editorState.getCurrentContent()));
    }

    const handleOnChange = editorState_ => setEditorState(editorState_);


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
            </div>
        </div>
    )
}

export default draftEditor;