import Requester from "../../requests/Requester";
import { 
    ADMIN_GET_USER_INCART_ITEMS,
    API
} from '../../requests/config';
import { Dispatch } from "react";
import { 
    ADMIN_GET_INCART_ITEMS_FAILED,
    ADMIN_GET_INCART_ITEMS_PENDING, 
    ADMIN_GET_INCART_ITEMS_SUCCESS 
} from "../actions";

const Requester_ = new Requester(API);

const getUsersIncartItemsPending = () => {
    return {
        type: ADMIN_GET_INCART_ITEMS_PENDING
    }
}

const getUsersIncartItemsSuccess = (amount: string, orders: any) => {
    return {
        type: ADMIN_GET_INCART_ITEMS_SUCCESS,
        payload: {
            in_cart: amount,
            orders
        }
    }
}

const getUsersIncartItemsFailed = (error: any) => {
    return {
        type: ADMIN_GET_INCART_ITEMS_FAILED,
        payload: error
    }
}

export const getUsersIncartItems = (api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(getUsersIncartItemsPending());

        Requester_.makeGetRequest(ADMIN_GET_USER_INCART_ITEMS, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.error){
                dispatcher(getUsersIncartItemsSuccess(res.in_cart, res.orders));
            } else {
                dispatcher(getUsersIncartItemsFailed(res.error));
            }
        }).catch((err) => {
            dispatcher(getUsersIncartItemsFailed(err));
        });
    }
};