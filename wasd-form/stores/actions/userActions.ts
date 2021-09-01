import axios from 'axios';
import { API, LOGIN_ROUTE } from '../../requests/config';
import { SET_USER } from '../actions';


export const SetUser = (user: any) => {
    return {
        type: SET_USER,
        payload: user
    }
};

export const LoginUser = async (login: {username: string, password: string}, dispatch : any) => {

    let result = await axios.post(`${API}/${LOGIN_ROUTE}`, {
        username: login.username,
        password: login.password
    },{
        headers: {
            "content-type": "application/json"
        }
    }).then((res) => {
        return res;
    }).catch((err) => {
        return err.response;
    });
    
    if(result?.data){
        if(result.data.api_key){
            dispatch({
                type: SET_USER,
                payload: result.data
            });
        } else if(result.data.error) {
            return result.data;
        }
    } else {
        return undefined;
    }
}

