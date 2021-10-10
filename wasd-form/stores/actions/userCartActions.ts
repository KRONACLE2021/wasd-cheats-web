import { Dispatch } from "redux";
import { API, CREATE_NEW_ORDER, GET_USER_INCART_ITEMS } from "../../requests/config"
import Requester from "../../requests/Requester"
import { ADD_ITEM_TO_CART, CLEAR_CART, FETCH_CART_ITEMS_FAILED, FETCH_CART_ITEMS_PENDING, FETCH_CART_ITEMS_SUCCESS, POST_CART_ITEMS_FAILED, POST_CART_ITEMS_PENDING, POST_CART_ITEMS_SUCCESS, REMOVE_ITEM_FROM_CART } from "../actions"

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
export const clearCart = () => {
    return {
        type: CLEAR_CART
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

const fetchItemsInCartPending = () => {
    return {
        type: FETCH_CART_ITEMS_PENDING
    }
}

const fetchItemsInCartSuccess = (items: Array<any>) => {
    return {
        type: FETCH_CART_ITEMS_SUCCESS,
        payload: items
    }
}

const fetchItemsInCartFailed = (errors: Array<any>) => {
    return {
        type: FETCH_CART_ITEMS_FAILED,
        payload: errors
    }
}

export const fetchItemsInCart = (api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(fetchItemsInCartPending())
        Requester_.makeGetRequest(GET_USER_INCART_ITEMS, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.error){
                dispatcher(fetchItemsInCartSuccess(res.order.items));
            } else{ 
                dispatcher(fetchItemsInCartFailed(res.errors));
            }
        }).catch((err) => {
            dispatcher(fetchItemsInCartFailed(err));
        })
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