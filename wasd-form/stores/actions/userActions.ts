import { Dispatch } from 'redux';
import { IPost, IUser } from '../../interfaces';
import { 
    API, 
    LOGIN_ROUTE, 
    REGISTER_ROUTE, 
    GET_CURRENT_USER, 
    GET_USER_POSTS,
    GET_USERS,
    UPDATE_USER_PROFILE,
    FETCH_USER,
    BAN_USER
} from '../../requests/config';
import Requester from '../../requests/Requester';
import { 
    ADMIN_BAN_USER_FAILED,
    ADMIN_BAN_USER_PENDING,
    ADMIN_BAN_USER_SUCCESS,
    ADMIN_USER_FETCH_FAILED,
    ADMIN_USER_FETCH_PENDING,
    ADMIN_USER_FETCH_SUCCESS,
    CACHE_USER_FAILED,
    CACHE_USER_PENDING,
    CACHE_USER_SUCCESS,
    FETCH_USER_PENDING, 
    FETCH_USER_POSTS_PENDING, 
    FETCH_USER_POSTS_SUCCESS, 
    FETCH_USER_SUCCESS, 
    SET_USER, 
    UPDATE_USER_FAILED, 
    UPDATE_USER_PENDING,
    UPDATE_USER_SUCCESS
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
            dispatch(adminFetchUsersFailed(err.errors))
        });
    }  
};

export const adminPaginationFetchUsers = (limit: number, skip: number, api_key: string) => {
    return (dispatch: Dispatch<any>) => {
        dispatch(adminFetchUsersPending());

        Requester_.makeGetRequest(GET_USERS, {
            queryStringParams: [
                { name: "sort", value: "PAGINATION" }, 
                { name: "limit", value: limit }, 
                { name: "skip", value: skip}
            ],
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
            dispatch(adminFetchUsersFailed(err.errors))
        });
    } 
}

export const LogoutUser = () => {
    return {
        type: SET_USER,
        payload: {}
    }
}

const updateUserPending = () => {
    return {
        type: UPDATE_USER_PENDING
    }
}

const updateUserSuccess = (user: any) => {
    return {
        type: UPDATE_USER_SUCCESS,
        payload: user
    }
}


const updateUserFailed = (errors: Array<string>) => {
    return {
        type: UPDATE_USER_FAILED,
        payload: errors
    }
}

export const UpdateUser = ({ bio, username, banner, avatar } : { bio: string, username: string, banner: string, avatar: string}, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(updateUserPending());

        Requester_.makePostRequest(UPDATE_USER_PROFILE, {
            bio,
            banner,
            avatar
        }, {
            queryStringParams: [],
            headers: {
                Authorization: api_key 
            }
        }).then((res) => {
            if(!res.error){
                updateUserSuccess(res.user);
            } else {
                dispatcher(updateUserFailed(res.errors));
            }
        }).catch(err => dispatcher(updateUserFailed(err.errors)));
    }
}

const fetchOtherUserPending = () => {
    return {
        type: CACHE_USER_PENDING
    }
}

const fetchOtherUserSuccess = (user: any) => {
    return {
        type: CACHE_USER_SUCCESS,
        payload: user
    }
}

const fetchOtherUserFailed = (err: Array<string>) => {
    return {
        type: CACHE_USER_FAILED,
        payload: err
    }
}

export const fetchOtherUser = (id: string, api_key?: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(fetchOtherUserPending());
        Requester_.makeGetRequest(FETCH_USER(id), {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.errors) {
                dispatcher(fetchOtherUserSuccess(res));
            } else {
                dispatcher(fetchOtherUserFailed(res.errors));
            }
        }).catch((err) => {
            dispatcher(fetchOtherUserFailed(err.errors));
        });
    }
}

const BanUserPending = () => {
    return {
        type: ADMIN_BAN_USER_PENDING
    }
}

const BanUserSuccess = (id: string) => {
    return {
        type: ADMIN_BAN_USER_SUCCESS,
        payload: id
    }
}

const BanUserFailed = (err: Array<string>) => {
    return {
        type: ADMIN_BAN_USER_FAILED,
        payload: err
    }
}

export const BanUser = (id: string, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(BanUserPending());
        Requester_.makePostRequest(BAN_USER(id), {
            
        }, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.error) {
                dispatcher(BanUserSuccess(id));
            } else {
                dispatcher(BanUserFailed(res.errors));
            }
        }).catch(err => {
            dispatcher(BanUserFailed(err.errors))
        })
    }
}