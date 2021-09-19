import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from '../../styles/fourms.module.css';

export default function UserPage() {
    
    const router = useRouter();
    const { query: { id } } = router;
    const [user, setUser] = useState(null);

    const userStore = useSelector(state => state.user);



    console.log(userStore);

    useEffect(() => {
        if(id == "me") {
            if(!userStore.uid){
                router.push('/login')
            }
        }
    }, [userStore]);


    useEffect(() => {
        if(id !== "me"){

        }
    }, [id]);

    return (
        <div className={style}>

        </div>
    );
}