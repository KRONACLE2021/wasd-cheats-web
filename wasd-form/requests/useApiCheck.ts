import axios from 'axios';
import { API, API_STATUS_CHECK } from './config';
import { useState, useEffect } from 'react';

export default function useApiCheck() {

    const [status, setStatus] = useState<string | boolean>(false);

    
    const startFetch = async () => {
        axios.get(`${API}/${API_STATUS_CHECK}`).then((res) => {
            if(res.data.status == "online") {
                setStatus("online");
            } else {
                setStatus("offline");
            }
        }).catch((err) => setStatus("offline"));
    }

    useEffect(() => {
        startFetch();
    }, []);


    return status;
} 