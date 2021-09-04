import axios from 'axios';
import { API, LOGIN_ROUTE, REGISTER_ROUTE, GET_CURRENT_USER } from '../../requests/config';
import { SET_USER } from '../actions';


export const SetUser = (user: any) => {
    return {
        type: SET_USER,
        payload: user
    }
};

export const RefreshUser = async (dispatch: any) => {
    if(typeof window !== "undefined"){

        console.log("[AUTH MANAGER] Trying to refresh previous session.")

        let api_key = localStorage.getItem("_wasd_api");

        if(!api_key) return;

        let result = await axios.get(`${API}/${GET_CURRENT_USER}`, {
            headers: {
                authorization: `${api_key}`
            }
        })
        .then((res) => res)
        .catch((err) => err.response);

        if(result?.data){
            if(result.data.username){
                dispatch({
                    type: SET_USER,
                    payload: result.data
                })
            } else if (result.data.error) {
                localStorage.removeItem("_wasd_api");
            }
        } else {
            console.log("[AUTH MANAGER] Failed to refresh users session");
        }
    }
}

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

            //Store credentials
            if(typeof window !== "undefined"){
                localStorage.setItem("_wasd_api", result.data.api_key);
            }
        
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


export const RegisterUser = async ({email, username, password}: {email : string, username: string, password: string}, dispatch : any) => {
    let result = await axios.post(`${API}/${REGISTER_ROUTE}`, {
        username,
        email,
        password
    }, {
        headers: {
            "content-type": "application/json"
        }
    })
    .then((res) => res)
    .catch((err) => err.response);
    

    if(result.data){
        if(result.data.api_key){
            dispatch({
                type: SET_USER,
                payload: result.data
            });

            return result.data;
        } else if (result.data.error) {
            return result.data;
        }
    } else {
        return undefined;
    }

}
