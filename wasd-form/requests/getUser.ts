import axios from 'axios';
import { API, FETCH_USER } from './config';

const fetchUser = async (uid: string, api_key?: string) => {
    let response = await axios.get(`${API}/${FETCH_USER(uid)}`, {
        headers: {
            Authorization: api_key
        }
    })
    .then((res) => res)
    .catch((err) => err.response);
    
    return response.data
}

export default fetchUser;