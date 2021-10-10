import { ADMIN_GET_INCART_ITEMS_PENDING, ADMIN_GET_INCART_ITEMS_SUCCESS, APPEND_SHOP_SUBSCRIPTIONS, DELETE_SUBSCRIPTION_ITEM_FAILED, DELETE_SUBSCRIPTION_ITEM_PENDING, DELETE_SUBSCRIPTION_ITEM_SUCCESS, GET_SHOP_SUBSCRIPTIONS_FAILED, GET_SHOP_SUBSCRIPTIONS_PENDING, SET_SHOP_SUBSCRIPTIONS } from "../actions";

const initalState = {
    loading: false,
    in_cart: 0,
    active_subscriptions: 0,
    completed_transactions: 0,
    total_transaction_value: 0,
    subscriptions: [],
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
        case APPEND_SHOP_SUBSCRIPTIONS:
            state.loading = false;
            state.subscriptions.push(action.payload);
            return state;
        case SET_SHOP_SUBSCRIPTIONS:
            state.loading = false;
            state.subscriptions = action.payload;
            return state;
        case GET_SHOP_SUBSCRIPTIONS_PENDING:
            state.loading = true;
            return state;
        case GET_SHOP_SUBSCRIPTIONS_FAILED:
            state.loading = false;
            state.errors = action.payload;
            return state;
        case DELETE_SUBSCRIPTION_ITEM_PENDING:
            state.loading = true;
            return state;
        case DELETE_SUBSCRIPTION_ITEM_FAILED:
            state.errors = action.payload;
            return state;
        case DELETE_SUBSCRIPTION_ITEM_SUCCESS:
            state.loading = false;
            return state;
        default:
            return state;
    }
} 