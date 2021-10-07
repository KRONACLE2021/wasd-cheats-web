import filterDuplicates from "../../utils/filterDuplicates";
import { GET_ITMES_PENDING, SET_SHOP_ITEMS, GET_ITEMS_FAILED, APPEND_SHOP_ITEM, GET_ITEM_PENDING, GET_ITEM_SUCCESS, GET_ITEM_FAILED } from "../actions";

const initalState = {
    items: [],
    loading: false,
    error: false,
    errors: [],
};

export default function shopItemsReducer(state : any = initalState, action : { type: string, payload: any }) {
    switch(action.type){
        case SET_SHOP_ITEMS:
            state.items = action.payload;
            state.loading = false;
            return state;
        case GET_ITMES_PENDING:
            state.loading = true;
            return state;
        case GET_ITEMS_FAILED:
            state.loading = false;
            state.error = true;
            state.errors = action.payload;
            return state;
        case APPEND_SHOP_ITEM:
            state.items.push(action.payload);
            filterDuplicates(state.items, (a, b) => a.id == b.id);
            return state;
        case GET_ITEM_PENDING:
            state.loading = true;
            return state;
        case GET_ITEM_SUCCESS:
            state.loading = false;
            state.items.push(action.payload);
            filterDuplicates(state.items, (a, b) => a.id == b.id);
            return state;
        case GET_ITEM_FAILED:
            state.loading = false;
            state.errors = action.payload;
            return state;
        default: 
            return state;
    }
}