import axios from 'axios';

import Requester from '../../requests/Requester';
import { API, CREATE_CATEGORY, FETCH_CATEGORYS } from '../../requests/config';
import { ADD_CATEGORY, CREATE_NEW_CATEGORY_FAILED, CREATE_NEW_CATEGORY_PENDING, CREATE_NEW_CATEGORY_SUCCESS, SET_CATEGORYS } from '../actions';
import { Dispatch } from 'redux';

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

const createNewCategoryPending = () => {
    return {
        type: CREATE_NEW_CATEGORY_PENDING
    }
}

const createNewCategorySuccess = (category: any) => {
    return {
        type: CREATE_NEW_CATEGORY_SUCCESS,
        payload: category
    }
}

const createNewCategoryFailed = (err: Array<string>) => {
    return {
        type: CREATE_NEW_CATEGORY_FAILED,
        payload: err
    }
}

export const CreateNewCategory = ({ title, description }: { title: string, description: string}, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(createNewCategoryPending());
        Requester_.makePostRequest(CREATE_CATEGORY, {
            title,
            description
        }, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then(res => {
            if(res.error){
                dispatcher(createNewCategoryFailed(res.errors))
            } else {
                dispatcher(createNewCategorySuccess(res.category));
            }
        })
    }
}