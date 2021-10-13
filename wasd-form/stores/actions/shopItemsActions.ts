import { Dispatch } from 'redux';
import { ADMIN_DELETE_SHOP_ITEM, API, GET_STORE_ITEM, GET_STORE_ITEMS } from '../../requests/config';
import Requester from '../../requests/Requester';
import { SET_SHOP_ITEMS, GET_ITMES_PENDING, GET_ITEMS_FAILED, APPEND_SHOP_ITEM, GET_ITEM_PENDING, GET_ITEM_SUCCESS, GET_ITEM_FAILED, DELETE_SHOP_ITEM_PENDING, DELETE_SHOP_ITEM_SUCCESS, DELETE_SHOP_ITEM_FAILED } from '../actions';

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

export const GetItemPending = () => {
    return {
        type: GET_ITEM_PENDING
    }
}

export const GetItemSuccess = (item: any) => {
    return {
        type: GET_ITEM_SUCCESS,
        payload: item
    }
}

export const GetItemFailed = (err: any) => {
    return {
        type: GET_ITEM_FAILED,
        payload: err
    }
}

export const GetItem = (id: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(GetItemPending);
        
        Requester_.makeGetRequest(GET_STORE_ITEM(id)).then((res) => {
            if(!res.error){
                dispatcher(GetItemSuccess(res.item));
            } else {
                dispatcher(GetItemFailed(res.error));
            }
        }).catch((err) => {
            dispatcher(GetItemFailed(err));
        });
    }
};

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

export const adminDeleteItemPending = () => {
    return {
        type: DELETE_SHOP_ITEM_PENDING
    }
}


export const adminDeleteItemSuccess = (id: string) => {
    return {
        type: DELETE_SHOP_ITEM_SUCCESS,
        payload: id
    }
}

export const adminDeleteItemFailed = (err: Array<string>) => {
    return {
        type: DELETE_SHOP_ITEM_FAILED,
        payload: err
    }   
}

export const AdminDeleteItem = (id: string, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(adminDeleteItemPending());
        Requester_.makePostRequest(ADMIN_DELETE_SHOP_ITEM(id), "", {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.error) {
                dispatcher(adminDeleteItemSuccess(id));
            } else {
                dispatcher(adminDeleteItemFailed(res.errors))
            }
        }).catch((err) => {
            dispatcher(adminDeleteItemFailed(err.errors));
        })
    }
}