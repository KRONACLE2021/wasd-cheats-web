import React, { useRef } from 'react';
import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from '../editor_js_tools';

const EditorJsSSR : React.FC<{ handleData: any, setData: any}> = (props) => {
    return (
        <EditorJs 
            instanceRef={instnace => (props.editorRef.current = instnace)}
            placeholder={"Your post here"}
            tools={EDITOR_JS_TOOLS}
            onReady={() => {
                console.log("[EDITOR.JS] Loaded SSR Friendly editor")
            }}    
        />
    )
}

export default EditorJsSSR;