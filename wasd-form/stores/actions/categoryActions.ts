import axios from 'axios';

import Requester from '../../requests/Requester';
import { API, FETCH_CATEGORYS } from '../../requests/config';
import { ADD_CATEGORY, SET_CATEGORYS } from '../actions';

const Requester_ = new Requester(API); 

export const FetchCategorys = async (dispatcher : any ) => {
    let result = await Requester_.makeGetRequest(FETCH_CATEGORYS);

    if(result.error) return result;

    dispatcher({
        type: SET_CATEGORYS,
        payload: result.categorys
    });

    return result;
}