import React from 'react'

const FullPageError: React.FC<{ error: Array<string> | string, code: number | null }> = (props) => {

    return (
        <div className="full_page_error_container">
            <div className="full_page_error">
                <h1 className="error_heading">Oopsie! Something went wrong.</h1>
                <p>See this error for more context: </p>
                <p>{props.error} | HTTP STATUS CODE: {props.code}</p>
            </div> 
        </div>
    )
} 
export default FullPageError;