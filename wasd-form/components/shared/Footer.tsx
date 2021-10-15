import React from 'react'


const Footer: React.FC<any> = (props) => {

    return (
        <>
            <div className={"footer-top-spacer"}></div>
            <div className={"footer"}>
                <div className={"footer-col"}>
                    <h3>ABOUT WASD</h3>
                    <p className={"footer-site-desc"}>WASD was founded in December 2020. Tree and MRK ran our community, but they decided to part ways, and now it's run by KRONACLE. We offer a wide range of products and plan to keep releasing new and popular games to cheat on. We provide great pricing and have a fantastic community with constant updates to our software. </p>
                    <div className={"line-spacer"}></div>
                    <p className={"site-credits"}>Custom built for wasd by <a href={"https://astrid.moe/"}>astrid</a> with ❤️</p>
                </div>
                <div className={"footer-col"}>
                    <h3>NAVIGATION</h3>
                    <ul>
                        <li>Fourms</li>
                        <li>Shop</li>
                        <li>Login</li>
                        <li>Settings</li>
                    </ul>
                </div>
            </div>
        </>
    )
} 

export default Footer;