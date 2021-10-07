import filterDuplicates from "../../utils/filterDuplicates";
import { ADD_ITEM_TO_CART, CLEAR_CART, FETCH_CART_ITEMS_FAILED, FETCH_CART_ITEMS_PENDING, FETCH_CART_ITEMS_SUCCESS, REMOVE_ITEM_FROM_CART } from "../actions";

const initalState = {
    loading: false,
    items: [],
    isCheckingOut: false
};

export default function userCartReducer(state : any = initalState, action : { type: string, payload: any }) {
    switch(action.type){
        case ADD_ITEM_TO_CART:
            state.items.push(action.payload);
            filterDuplicates(state.items, (a: { id: string }, b: { id: string }) => a.id == b.id);
            return state;
        case REMOVE_ITEM_FROM_CART:
            if(state.items.indexOf(action.payload) == -1) return state;
            state.items.splice(state.items.indexOf(action.payload), 1);
            return state;
        case CLEAR_CART:
            state.items = [];
            return state;
        case FETCH_CART_ITEMS_PENDING:
            state.loading = true;
            return state;
        case FETCH_CART_ITEMS_FAILED:
            state.loading = false;
            state.error = action.payload;
            return state;
        case FETCH_CART_ITEMS_SUCCESS:
            state.loading = false;
            state.items = action.payload;
            return state;
        default: 
            return state;
    }
}
