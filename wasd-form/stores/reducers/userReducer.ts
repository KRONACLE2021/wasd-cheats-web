import { SET_USER, UNSET_USER } from "../actions";

const initalState = {};

export default function userReducer(state : any = initalState, action : { type: string, payload: any}) {
    switch(action.type) {
        case SET_USER:
            return state = action.payload;
        default:
            return state;
    }
}