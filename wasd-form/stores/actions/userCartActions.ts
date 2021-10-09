import { Dispatch } from "redux";
import { API, CREATE_NEW_ORDER } from "../../requests/config"
import Requester from "../../requests/Requester"
import { ADD_ITEM_TO_CART, POST_CART_ITEMS_FAILED, POST_CART_ITEMS_PENDING, POST_CART_ITEMS_SUCCESS, REMOVE_ITEM_FROM_CART } from "../actions"

const Requester_ = new Requester(API);

export const addItemToCart = (item: any) => {
    return {
        type: ADD_ITEM_TO_CART,
        payload: item
    }
}

export const removeItemFromCart = (item: any) => {
    return {
        type: REMOVE_ITEM_FROM_CART,
        payload: item 
    }
}

const postCartItemsPending = () => {
    return {
        type: POST_CART_ITEMS_PENDING
    }
}

const postCartItemsSuccess = () => {
    return {
        type: POST_CART_ITEMS_SUCCESS
    }
}

const postCartItemsFailed = (err: any) => {
    return {
        type: POST_CART_ITEMS_FAILED,
        payload: err
    }
}

export const postCartItems = (items: Array<string>, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(postCartItemsPending());

        Requester_.makePostRequest(CREATE_NEW_ORDER, {
            items: items
        }, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(res.error){
                dispatcher(postCartItemsFailed(res.errors));
            } else {
                dispatcher(postCartItemsSuccess());
            }
        }).catch(err => dispatcher(postCartItemsFailed(err)));
    }
}