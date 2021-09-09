import React from 'react'

const FourmError: React.FC<{ error: string, errorDescription: string | null }> = ({ error, errorDescription }) => {
    return (
        <div className="box-error">
            <h3>{error}</h3>
            <p>{errorDescription}</p>
        </div>
    )
};

export default FourmError;