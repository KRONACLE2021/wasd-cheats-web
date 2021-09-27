import { API, GET_STORE_ITEMS } from '../../requests/config';
import Requester from '../../requests/Requester';
import { SET_SHOP_ITEMS } from '../actions';

const Requester_ = new Requester(API);

export const GetItems = async (dispatcher: any) => {

    let res = await Requester_.makeGetRequest(GET_STORE_ITEMS);

    if(!res.error){
        dispatcher({
            type: SET_SHOP_ITEMS,
            payload: res.items
        });

        return res;
    } else {
        return res;
    }
}


export const AdminAddItem = async (api_key: string, dispatcher: any) => {

}