import filterDuplicates from "../../utils/filterDuplicates";
import { 
    SET_USER, 
    FETCH_USER_PENDING, 
    FETCH_USER_SUCCESS, 
    UNSET_USER, 
    FETCH_USER_POSTS_PENDING, 
    FETCH_USER_POSTS_SUCCESS, 
    ADMIN_USER_FETCH_PENDING, 
    ADMIN_USER_FETCH_SUCCESS, 
    ADMIN_USER_FETCH_FAILED, 
    UPDATE_USER_PENDING, 
    UPDATE_USER_FAILED, 
    UPDATE_USER_SUCCESS,
    CACHE_USER_PENDING,
    CACHE_USER_FAILED,
    CACHE_USER_SUCCESS,
    ADMIN_BAN_USER_SUCCESS,
    EDIT_CACHED_USER,
    UPDATE_CACHED_USER_FAILED
} from "../actions";

const initalState = {
    loading: false,
    user: {},
    otherCachedUsers: []
};

export default function userReducer(state : any = initalState, action : { type: string, payload: any}) {
    switch(action.type) {
        case FETCH_USER_PENDING:
            state.loading = true; 
            return state;
        case FETCH_USER_SUCCESS:
            state.loading = false;
            state.user = action.payload;
            return state;
        case SET_USER:
            state.user = action.payload
            return state;
        case FETCH_USER_POSTS_SUCCESS:
            if(action.payload.id == state?.user?.uid){
                state.user.posts = action.payload.posts
            } else {
                if(state.otherCachedUsers.filter((i: any) => i["uid"] == action.payload.id).length !== 0){
                    state.otherCachedUsers[state.otherCachedUsers.indexOf(state.otherCachedUsers.filter((i : any) => i["uid"] == action.payload.id)[0])].posts = action.payload.posts;
                }
            }
        case ADMIN_USER_FETCH_PENDING:
            state.loading = true;
            return state;
        case ADMIN_USER_FETCH_SUCCESS:
            state.loading = false;
            state.otherCachedUsers = action.payload;
            return state;
        case ADMIN_USER_FETCH_FAILED:
            state.loading = false;
            state.errors = action.payload;
            return state;
        case UPDATE_USER_PENDING:
            state.loading = true;
            return state;
        case UPDATE_USER_SUCCESS:
            state.loading = false;
            state.user = action.payload;
            return state;
        case UPDATE_USER_FAILED:
            state.loading = false;
            state.errors = [];
            return state;
        case CACHE_USER_PENDING:
            state.loading = true;
            return state;
        case CACHE_USER_FAILED:
            state.loading = false;
            state.errors = action.payload;
            return state;
        case CACHE_USER_SUCCESS:
            state.loading = false;
            state.otherCachedUsers.push(action.payload);
            state.otherCachedUsers = filterDuplicates(state.otherCachedUsers, (a: any, b: any) => a.id == b.id);
            return state;
        case ADMIN_BAN_USER_SUCCESS:
            state.otherCachedUsers = state.otherCachedUsers.map((i) => {
                if(i.uid == action.payload){
                    i.banned = !i.banned;
                    return i
                } else {
                    return i;
                }
            });

            return state;
        case EDIT_CACHED_USER:
            state.otherCachedUsers = state.otherCachedUsers.map((i) => {
                if(i.uid == action.payload.uid){
                    return action.payload;
                } else {
                    return i;
                }
            })
            return state;
        case UPDATE_CACHED_USER_FAILED:
            state.error = action.payload;
            return state;
        default:
            return state;
    }
}