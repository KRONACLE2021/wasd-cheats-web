import React, { useState } from 'react'
import { EditorState, RichUtils } from 'draft-js';
import dynamic from 'next/dynamic';
import Toolbar from './toolbar/Toolbar';
import { stateToHTML } from 'draft-js-export-html';
import createImagePlugin from '@draft-js-plugins/image';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';

const Editor = dynamic(import("draft-js").then(module => module.Editor), {
    ssr: false
});

const draftEditor: React.FC<{output: Function, placeholder: string}> = (props) => {

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const imagePlugin = createImagePlugin();
    const dragNdDrop = createBlockDndPlugin();


    const toggleBlockType = (blockType : string) => {
        let newState = RichUtils.toggleBlockType(editorState, blockType);

        console.log(blockType);
        setEditorState(newState);
    }

    const createContent = () => {
        props.output(stateToHTML(editorState.getCurrentContent()));
    }

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
                    onChange={(state: any) => { setEditorState(state); createContent() } } 
                    plugins={[imagePlugin, dragNdDrop]}
                />
            </div>
        </div>
    )
}

export default draftEditor;