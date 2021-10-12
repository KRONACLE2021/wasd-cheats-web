import { Dispatch } from 'redux';
import { IPost, IUser } from '../../interfaces';
import { 
    API, 
    LOGIN_ROUTE, 
    REGISTER_ROUTE, 
    GET_CURRENT_USER, 
    GET_USER_POSTS,
    GET_USERS
} from '../../requests/config';
import Requester from '../../requests/Requester';
import { 
    ADMIN_USER_FETCH_FAILED,
    ADMIN_USER_FETCH_PENDING,
    ADMIN_USER_FETCH_SUCCESS,
    FETCH_USER_PENDING, 
    FETCH_USER_POSTS_PENDING, 
    FETCH_USER_POSTS_SUCCESS, 
    FETCH_USER_SUCCESS, 
    SET_USER 
} from '../actions';

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

export const FetchUserPostsPending = () => {
    return {
        type: FETCH_USER_POSTS_PENDING   
    }
}

export const FetchUserPostsSuccess = (id: string, posts: Array<IPost>) => {
    return {
        type: FETCH_USER_POSTS_SUCCESS,
        payload: {
            id: id,
            posts: posts
        }
    }
}


export const FetchUsersPosts = (id: string) => {

    let _id = id;

    return (dispatch: Dispatch<any>) => {
        dispatch(FetchUserPostsPending());
        Requester_.makeGetRequest(`${GET_USER_POSTS(_id)}`).then((res) => {
            if(!res.error){
                dispatch(FetchUserPostsSuccess(_id, res.posts));
            } else {
                
            }
        }).catch((err) => {

        });
    }
}

export const RefreshUser = () => {
    return (dispatch: Dispatch<any>) => {
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

export const LoginUser = async (login: {username: string, password: string, h_captcha: string }, dispatch : any) => {

    let result = await Requester_.makePostRequest(LOGIN_ROUTE, {
        username: login.username,
        password: login.password,
        h_captcha: login.h_captcha
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


export const RegisterUser = async ({email, username, password, h_captcha}: {email : string, username: string, password: string, h_captcha: string | undefined }, dispatch : any) => {
    let result = await Requester_.makePostRequest(REGISTER_ROUTE, {
        username,
        email,
        password,
        h_captcha
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

const adminFetchUsersPending = () => {
    return {
        type: ADMIN_USER_FETCH_PENDING 
    }
}

const adminFetchUsersSuccess = (users: Array<IUser>) => {
    return {
        type: ADMIN_USER_FETCH_SUCCESS,
        payload: users
    }
}

const adminFetchUsersFailed = (error: any) => {
    return {
        type:  ADMIN_USER_FETCH_FAILED,
        payload: error
    }
}

export const adminFetchUsers = (sortBy: string, api_key: string) => {


    return (dispatch: Dispatch<any>) => {
        dispatch(adminFetchUsersPending());

        Requester_.makeGetRequest(GET_USERS, {
            queryStringParams: [{ name: "sort", value: sortBy }],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.error) {
                dispatch(adminFetchUsersSuccess(res.users));
            } else {
                dispatch(adminFetchUsersFailed(res.errors));
            }
        }).catch((err) => {
            dispatch(adminFetchUsersFailed(err))
        });
    }  
};

export const LogoutUser = () => {
    return {
        type: SET_USER,
        payload: {}
    }
}