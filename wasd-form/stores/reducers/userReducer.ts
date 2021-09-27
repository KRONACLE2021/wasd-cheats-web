import { SET_USER, FETCH_USER_PENDING, FETCH_USER_SUCCESS, UNSET_USER } from "../actions";

const initalState = {
    loading: false,
    user: {}
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
        default:
            return state;
    }
}