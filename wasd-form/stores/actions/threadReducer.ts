import axios from 'axios';
import { API, CREATE_NEW_THREAD } from '../../requests/config';

import { ADD_THREADS, CREATE_THREAD } from '../actions';

export const AddThread = (payload : Array<any> | object) => {
    return {
        type: ADD_THREADS,
        payload: payload
    }
}

export const CreateThread = async ({title, post, attachments, topic_id} : {title: string, post : any, attachments: Array<any> | null, topic_id: string}, api_key: string, dispatcher : any) => {

    let response = await axios.post(`${API}/${CREATE_NEW_THREAD}`, {
        title,
        topic_id,
        post: {
            contents: post
        }
    }, {
        headers: { 
            authorization: api_key
        }
    }).then((res) => res)
    .catch((err) => err.response);

    let data = response.data;

    if(!data?.error && data?.title){
        dispatcher({
            type: CREATE_THREAD,
            payload: data
        })
        return data;
    } else {
        return data;
    }
}