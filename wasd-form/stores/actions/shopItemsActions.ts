import { Dispatch } from 'redux';
import { API, GET_STORE_ITEMS } from '../../requests/config';
import Requester from '../../requests/Requester';
import { SET_SHOP_ITEMS, GET_ITMES_PENDING, GET_ITEMS_FAILED, APPEND_SHOP_ITEM } from '../actions';

const Requester_ = new Requester(API);

export const GetItemsPending = () => {
    return {
        type: GET_ITMES_PENDING
    }
} 

export const GetItemsFailed = (err: Array<string>) => {
    return {
        type: GET_ITEMS_FAILED,
        payload: err
    }
}

export const GetItems = () => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(GetItemsPending());
        Requester_.makeGetRequest(GET_STORE_ITEMS).then((res) => {
            if(!res.error){
                dispatcher({
                    type: SET_SHOP_ITEMS,
                    payload: res.items
                });
            } else {
                dispatcher(GetItemsFailed(res.errors));
            }
        }).catch((err) => dispatcher(GetItemsFailed(err)));
    }
}


export const appendShopItem = (item: any) => {
    return {
        type: APPEND_SHOP_ITEM,
        payload: item
    }
}