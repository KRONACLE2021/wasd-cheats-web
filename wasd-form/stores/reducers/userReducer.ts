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
    CACHE_USER_FAILED
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
        default:
            return state;
    }
}