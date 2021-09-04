import React from 'react';
import EditorJs from 'react-editor-js';
import FourmRoot from '../../../../components/fourm/FourmRoot';
import { useRouter } from 'next/router';
import { EDITOR_JS_TOOLS } from '../../../../components/editor_js_tools';

const NewThread: React.FC<any> = (props) => {

    const router = useRouter();

    const { query: { id } } = router;


    console.log(id);
    return (
        <div>
           {
               typeof window !== undefined ? (
                <EditorJs tools={EDITOR_JS_TOOLS} />
               ) : ""
           }
        </div>
    );
}

export default NewThread;