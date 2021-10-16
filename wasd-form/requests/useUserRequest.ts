import axios from 'axios';
import { API, API_STATUS_CHECK, FETCH_USER } from './config';
import { useState, useEffect } from 'react';
import { IUser, IApiError } from '../interfaces';

export default function useUserRequest(id: string) {

    const [user, setUser] = useState<any>(false);

    
    const startFetch = async () => {
        axios.get(`${API}/${FETCH_USER(id)}`).then((res) => {
            setUser(res.data);
        }).catch((err) => setUser({ error: true, errors: err.response.data.errors}));
    }

    useEffect(() => {
        startFetch();
    }, []);


    return user;
} 