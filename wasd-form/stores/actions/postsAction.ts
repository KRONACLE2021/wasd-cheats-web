import axios from 'axios';
import { IUser } from '../../interfaces';

import { API, FETCH_POSTS_BY_THREAD } from '../../requests/config';
import Requester from '../../requests/Requester';
import  { ADD_POSTS, SET_POST_OWNER } from '../actions';

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
export const SetPostUser = (id: string, user: IUser) => {
    return {
        type: SET_POST_OWNER,
        payload: {
            post_id: id,
            user: user
        }
    }
}