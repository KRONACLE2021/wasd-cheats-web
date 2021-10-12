import React, { useEffect } from 'react';
import Router from 'next/router';
import { LogoutUser } from '../stores/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';

const Logout: React.FC<any> = (props) => {

    const dispatch = useDispatch();

    const userStore = useSelector(state => state.user.user);

    useEffect(() => {
        if(userStore){
            if(userStore.username) {
                dispatch(LogoutUser());

                localStorage.removeItem("_wasd_api");
                
                Router.push("/");
            } 
        }
    }, [userStore]);

    return (
        <>
        </>
    );
}

export default Logout;