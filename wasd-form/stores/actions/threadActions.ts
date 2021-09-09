import axios from 'axios';
import { IUser } from '../../interfaces';
import { API, CREATE_NEW_THREAD, FETCH_THREADS, FETCH_THREAD } from '../../requests/config';
import Requester from '../../requests/Requester';

import { ADD_THREADS, CREATE_THREAD, SET_THREAD_OWNER, SET_TOTAL_THREADS } from '../actions';

const Requester_ = new Requester(API);

export const AddThread = (payload : Array<any> | object) => {
    return {
        type: ADD_THREADS,
        payload: payload
    }
}

export const CreateThread = async ({title, post, attachments, topic_id} : {title: string, post : any, attachments: Array<any> | null, topic_id: string}, api_key: string, dispatcher : any) => {

    let response = await Requester_.makePostRequest(CREATE_NEW_THREAD, { 
        title,
        topic_id,
        post: {
            contents: post
        }
    }, {
        headers: {
            authorization: api_key
        },
        queryStringParams: []
    });

    if(!response.error){
        dispatcher({
            type: CREATE_THREAD,
            payload: response
        });
        return response
    } else {
        return response
    }
}

export const FetchThreadsByTopic = async (topic_id : string, skip : number, limit: number, dispatcher : any) => {
    
    let response = await Requester_.makeGetRequest(FETCH_THREADS(topic_id), { 
        headers: {},
        queryStringParams: [
            {
                name: "skip",
                value: skip
            },
            {
                name: "limit",
                value: limit
            }
        ]
    })

    if(!response.error) {
        dispatcher({
            type: ADD_THREADS,
            payload: { 
                threads: response.threads,
                amount: response.total
            }
        });
        return response;
    } else {
        return response;
    }
}

export const FetchThreadById = async (id : string, dispatcher: any) => {

    let response = await Requester_.makeGetRequest(FETCH_THREAD(id));

    if(!response?.error) {
        dispatcher({
            type: CREATE_THREAD,
            payload: response 
        });
        return response;
    } else {
        return response;
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