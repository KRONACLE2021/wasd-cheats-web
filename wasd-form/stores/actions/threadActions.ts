import axios from 'axios';
import { IUser } from '../../interfaces';
import { API, CREATE_NEW_THREAD, FETCH_THREADS, FETCH_THREAD } from '../../requests/config';
import Requester from '../../requests/Requester';

import { ADD_THREADS, CREATE_THREAD, FETCH_THREADS_FAILED, FETCH_THREADS_PENDING, FETCH_THREADS_SUCCESS, SET_THREAD_OWNER, SET_TOTAL_THREADS } from '../actions';

const Requester_ = new Requester(API);

export const AddThread = (payload : Array<any> | object) => {
    return {
        type: ADD_THREADS,
        payload: payload
    }
}

export const FetchThreadsSuccess = (payload: Array<any> | object) => {
    console.log("what?");
    return {
        type: FETCH_THREADS_SUCCESS,
        payload: payload
    }
}

export const FetchThreadsPending = () => {
    return {
        type: FETCH_THREADS_PENDING
    }
}

export const FetchThreadsFailed = (errors: Array<string>) => {
    return {
        type: FETCH_THREADS_FAILED,
        payload: errors
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

export const FetchThreadsByTopic = (topic_id : string, skip : number, limit: number) => {
    
    let topic_id_ = topic_id;
    let skip_ = skip;
    let limit_ = limit;

    return (disaptch) => {

        disaptch(FetchThreadsPending());
        Requester_.makeGetRequest(FETCH_THREADS(topic_id_), { 
            headers: {},
            queryStringParams: [
                {
                    name: "skip",
                    value: skip_
                },
                {
                    name: "limit",
                    value: limit_
                }
            ]
        }).then((res) => {
            console.log(res);
            if(!res.error){
                disaptch(FetchThreadsSuccess({ threads: res.threads, amount: res.total }));
            } else {
                disaptch(FetchThreadsFailed(res.errors))
            }
        }).catch((err) => {
            console.log("Theres an error", err);
            disaptch(FetchThreadsFailed(err.errors));
        });
    
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