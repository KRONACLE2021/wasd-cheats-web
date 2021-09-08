import React from 'react'

const Preloader: React.FC<any> = (props) => {
    return (
        <div className="preloader">
            <img src={"/logo.png"} className="prelaoder_logo" />
        </div>
    )
}

export default Preloader;