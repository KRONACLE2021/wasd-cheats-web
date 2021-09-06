import React from 'react'

const ToolbarButton: React.FC<{label: any, onToggle: Function, active: boolean, style: string}> = (props) => {

    const onToggle = e => {
        e.preventDefault();
        props.onToggle(props.style);
    }

    return(
        <span className={`editor_button ${props.active ? "editor_active" : ""}`} onClick={onToggle}>
            {props.label}
        </span>
    )
} 

export default ToolbarButton