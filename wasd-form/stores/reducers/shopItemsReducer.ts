import { GET_ITMES_PENDING, SET_SHOP_ITEMS, GET_ITEMS_FAILED } from "../actions";

const initalState = {
    items: [],
    loading: false,
    error: false,
    errors: []
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
        default: 
            return state;
    }
}