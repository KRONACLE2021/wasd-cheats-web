import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Preloader from '../../components/shared/Preloader';

export default function AdminPanel() {
    const [isLoading, setLoading] = useState(true);

    let userStore = useSelector(state => state.user);

    useEffect(() => {
        if(userStore){
            if(userStore.username){
                if(userStore.permissions.includes("ADMINISTRATOR")) {
                    setLoading(false);
                } 
            } else {
                
            }
        } else {
            Router.push("/fourm")            
        }
    }, [userStore]);

    if(isLoading) return <Preloader />;

    return (
        <div>

        </div>
    )
}