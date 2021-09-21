import axios from 'axios';
import { IUser } from '../../interfaces';

import { API, FETCH_POSTS_BY_THREAD, CREATE_NEW_POST, DELETE_POST } from '../../requests/config';
import Requester from '../../requests/Requester';
import  { ADD_POSTS, CREATE_POST, SET_POST_OWNER, POST_DELETE} from '../actions';

const Requester_ = new Requester(API);

export const FetchPostsByThreadId = async (id: string, limit: number = 20, skip: number = 0, dispatcher: any) => {
    
    let response = await Requester_.makeGetRequest(FETCH_POSTS_BY_THREAD(id), { 
        queryStringParams: [
            { name: "limit", value: limit}, 
            { name: "skip", value: skip}
        ], headers: {} });
    
    if(response.error) return response;

    dispatcher({
        type: ADD_POSTS,
        payload: response
    });

}

export const CreatePost = async (contents: any, attachments: Array<string>, thread_id: string, api_key: string, dispatcher: any) => {

    let response = await Requester_.makePostRequest(CREATE_NEW_POST, {
        contents: contents,
        attachments: attachments,
        thread_id: thread_id
    }, {
        headers: {
            authorization: api_key
        },
        queryStringParams: []
    });

    if(response.error){
        return response;
    }

    dispatcher({
        type: CREATE_POST,
        payload: response
    })

    return response;
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


export const DeletePost = async (id: string, api_key: string, dispatcher: any) => {
    let response = await Requester_.makeDeleteRequest(DELETE_POST(id), { 
        headers: {
            authorization: api_key
        },
        queryStringParams: []
    });

    console.log(response);

    if(response.done) {
        dispatcher({
            type: POST_DELETE,
            payload: {
                post_id: id
            }
        })
    } else {
        return response;
    }
}