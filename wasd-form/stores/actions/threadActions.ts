import axios from 'axios';
import { IUser } from '../../interfaces';
import { API, CREATE_NEW_THREAD, FETCH_THREADS, FETCH_THREAD } from '../../requests/config';

import { ADD_THREADS, CREATE_THREAD, SET_THREAD_OWNER } from '../actions';

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

export const FetchThreadsByTopic = async (topic_id : string, skip : number, limit: number, dispatcher : any) => {
    
    let response = await axios.get(`${API}/${FETCH_THREADS(topic_id)}`)
    .then((res) => res)
    .catch((err) =>  err.response);

    let data = response.data;

    if(!data?.error) {
        dispatcher({
            type: ADD_THREADS,
            payload: data
        })
        return data;
    } else {
        return data;
    }
}

export const FetchThreadById = async (id : string, dispatcher: any) => {
    let response = await axios.get(`${API}/${FETCH_THREAD(id)}`)
    .then((res) => res)
    .catch((err) =>  err.response);

    let data = response.data;

    if(!data?.error) {
        dispatcher({
            type: CREATE_THREAD,
            payload: data 
        })
        return data;
    } else {
        return data;
    }
}


export const SetOwner = (id: string, user: IUser) => {
    return {
        type: SET_THREAD_OWNER,
        payload: {
            thread_id: id,
            user: user
        }
    }
}