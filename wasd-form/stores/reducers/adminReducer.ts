import { ADMIN_GET_INCART_ITEMS_PENDING, ADMIN_GET_INCART_ITEMS_SUCCESS } from "../actions";

const initalState = {
    loading: false,
    in_cart: 0,
    active_subscriptions: 0,
    completed_transactions: 0,
    total_transaction_value: 0,
    orders: {}
};

export default function adminReducer(state: any = initalState, action : { type: string, payload: any}) {
    switch(action.type) {
        case ADMIN_GET_INCART_ITEMS_PENDING:
            state.loading = true;
            return state;

        case ADMIN_GET_INCART_ITEMS_SUCCESS:
            state.loading = false;
            state.in_cart = action.payload.in_cart;
            state.orders = action.payload.orders;
            return state;
        default:
            return state;
    }
} 