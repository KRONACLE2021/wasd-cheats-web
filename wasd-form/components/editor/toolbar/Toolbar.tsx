import React from 'react'
import ToolbarButton from './ToolbarButton';

export const block_types = [
    { label: "'' ''", style: "RichEditor-blockquote" },
    { label: "UL", style: "unordered-list-item" },
    { label: "< >", style: "code-block" },
];

export const header_types = [
    { label: "P", style: "unstyled" },
    { label: "H1", style: "header-one" },
    { label: "H2", style: "header-two" },
    { label: "H3", style: "header-three" },
    { label: "H4", style: "header-four" },
    { label: "H5", style: "header-five" },
    { label: "H6", style: "header-six" },
];

const Toolbar: React.FC<any> = (props) => {

    let { editorState } = props;

    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

    return (
        <div>
            {block_types.map(type => {
                return (
                    <ToolbarButton 
                        onToggle={props.onToggle}
                        label={type.label}
                        active={type.style == blockType}
                        style={type.style}
                    />
                )
            })}

            {header_types.map(type => {
                return (
                    <ToolbarButton 
                        onToggle={props.onToggle}
                        label={type.label}
                        active={type.style == blockType}
                        style={type.style}
                    />
                )
            })}
        </div>
    )
}

export default Toolbar;