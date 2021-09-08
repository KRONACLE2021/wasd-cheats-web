import axios from 'axios';
import { API, FETCH_USER } from './config';

const fetchUser = async (uid: string) => {
    let response = await axios.get(`${API}/${FETCH_USER(uid)}`)
    .then((res) => res)
    .catch((err) => err.response);
    
    return response.data
}

export default fetchUser;