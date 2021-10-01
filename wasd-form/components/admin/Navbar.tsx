import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/admin.module.css';
import getAvatar from '../../utils/getAvatar';
import getUserPermission, { getPermissionColor, permissions } from '../../utils/getUserPermission';
import { faUser, faShoppingBag, faExclamationTriangle, faTools, faBox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const Navbar: React.FC<any> = () => {

    const user = useSelector(state => state.user.user);

    const navLinks = [
        {
            name: "Dashboard",
            to: "/admin",
            icon: <FontAwesomeIcon icon={faBox}></FontAwesomeIcon>
        },
        {
            name: "Manage Store",
            to: "/admin/shop",
            icon: <FontAwesomeIcon icon={faShoppingBag}></FontAwesomeIcon>
        },
        {
            name: "Fourm",
            to: "/admin/fourm",
            icon: <FontAwesomeIcon icon={faTools}></FontAwesomeIcon>
        },
        {
            name: "Fourm Reports",
            to: "/admin/fourm/reports",
            icon: <FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon>
        },
        {
            name: "Users",
            to: "/admin/users",
            icon: <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
        }
    ]

    return (
        <div className={styles.navbar_root}>
            <div className={styles.logged_in_user}>
                <img className={styles.pfp} src={getAvatar(user)}></img>
                <h3>Welcome, {user.username}</h3>
                <p className={getPermissionColor(user.permissions)}>{getUserPermission(user.permissions)}</p>
            </div>

            <div className={styles.navbar_items}>
                <ul>
                    {navLinks.map((i) => {
                        return <Link href={i.to}><li>{i.icon}<span>{i.name}</span></li></Link>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Navbar;