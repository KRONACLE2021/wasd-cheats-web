import { SET_SHOP_ITEMS } from "../actions";

const initalState = {
    items: []
};

export default function shopItemsReducer(state : any = initalState, action : { type: string, payload: any }) {
    switch(action.type){
        case SET_SHOP_ITEMS:
            state.items = action.payload;
            return state;
        default: 
            return state;
    }
}