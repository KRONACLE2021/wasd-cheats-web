import { IUser } from '../../interfaces';
import { 
    API, 
    LOGIN_ROUTE, 
    REGISTER_ROUTE, 
    GET_CURRENT_USER 
} from '../../requests/config';
import Requester from '../../requests/Requester';
import { FETCH_USER_PENDING, FETCH_USER_SUCCESS, SET_USER } from '../actions';

const Requester_ = new Requester(API);

export const SetUser = (user: any) => {
    return {
        type: SET_USER,
        payload: user
    }
};

export const FetchUserPending = () => {
    return {
        type: FETCH_USER_PENDING
    }
}

export const FetchUserSuccess = (user: any) => {
    return {
        type: FETCH_USER_SUCCESS,
        payload: user
    }
}


export const RefreshUser = () => {
    return (dispatch) => {
        if(typeof window !== "undefined"){

            dispatch(FetchUserPending());

            console.log("[AUTH MANAGER] Trying to refresh previous session.")
    
            let api_key = localStorage.getItem("_wasd_api");
    
            if(!api_key) {
                console.log("[AUTH MANAGER] No Previous user has logged in.")
                return;
            };
    
            Requester_.makeGetRequest(GET_CURRENT_USER, {
                headers: {
                    authorization: `${api_key}`
                },
                queryStringParams: []
            }).then((res) => {
                if(!res.error){
                    dispatch(FetchUserSuccess(res));
                }
            }).catch((err) => {
                console.log("[AUTH MANAGER] Failed to refresh users session");
            });
    
    
        }
    }

}

export const LoginUser = async (login: {username: string, password: string}, dispatch : any) => {

    let result = await Requester_.makePostRequest(LOGIN_ROUTE, {
        username: login.username,
        password: login.password
    },{
        headers: {
            "content-type": "application/json"
        },
        queryStringParams: []
    });
    
    if(!result?.error){
        if(result.api_key){

            //Store credentials
            if(typeof window !== "undefined"){
                localStorage.setItem("_wasd_api", result.api_key);
            }
        
            dispatch({
                type: SET_USER,
                payload: result
            });
        } 
    } else {
        return result;
    }
}


export const RegisterUser = async ({email, username, password}: {email : string, username: string, password: string}, dispatch : any) => {
    let result = await Requester_.makePostRequest(REGISTER_ROUTE, {
        username,
        email,
        password
    }, {
        headers: {
            "content-type": "application/json"
        },
        queryStringParams: []
    });

    if(!result.error){
        if(result.api_key){
            dispatch({
                type: SET_USER,
                payload: result
            });

            //Store credentials
            if(typeof window !== "undefined"){
                localStorage.setItem("_wasd_api", result.api_key);
            }

            return result;
        }
    } else {
        return result;
    }

}

export const LogoutUser = () => {
    return {
        type: SET_USER,
        payload: {}
    }
}