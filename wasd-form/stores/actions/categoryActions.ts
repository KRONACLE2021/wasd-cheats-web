import axios from 'axios';

import { API, FETCH_CATEGORYS } from '../../requests/config';
import { ADD_CATEGORY, SET_CATEGORYS } from '../actions';

export const FetchCategorys = async (dispatcher : any ) => {
    let result = await axios.get(`${API}/${FETCH_CATEGORYS}`)
    .then((res) => res)
    .catch((err) => err.response);

    if(!result?.data?.error && result !== undefined) {
        if(result.data.categorys){
            dispatcher({
                type: SET_CATEGORYS,
                payload: result.data.categorys
            })
            
            return result.data;
        }
    } else {
        return result.data;
    }
}