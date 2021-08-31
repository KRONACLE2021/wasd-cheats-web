import React from 'react';
import styles from '../../styles/navigation.module.css';
import Link from 'next/link';

const Navbar : React.FC<any> = (props) => {
    return (
        <div className={styles.navbar_container}>
            <img src={"/logo.png"} className={styles.logo}/>
            <nav>
                <ul className={styles.nav_links}>
                    <li><Link href={"/fourms"}>Fourms</Link></li>
                    <li><Link href={"/fourms"}>Shop</Link></li>
                    <li><Link href={"/fourms"}>Pricing</Link></li>
                </ul>
            </nav>
            <button className={styles.login_button}>Login</button>
        </div>
    );
}

export default Navbar;