import axios from 'axios';
import { IUser } from '../../interfaces';

import { API, FETCH_POSTS_BY_THREAD } from '../../requests/config';
import  { ADD_POSTS, SET_POST_OWNER } from '../actions';

export const FetchPostsByThreadId = async (id: string, limit: number, skip: number, dispatcher: any) => {
    let response = await axios.get(`${API}/${FETCH_POSTS_BY_THREAD(id)}?limit=${20}&skip=${skip}`)
    .then((res) => res)
    .catch((err) => err.response);

    let data = response?.data;
    
    if(!data.error && data !== undefined) {
        dispatcher({
            type: ADD_POSTS,
            payload: data
        });

        return data;
    } else {
        return data;
    }
}

export const SetPostUser = (id: string, user: IUser) => {
    return {
        type: SET_POST_OWNER,
        payload: {
            post_id: id,
            user: user
        }
    }
}