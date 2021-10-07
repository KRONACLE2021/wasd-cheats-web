import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART } from "../actions"

export const addItemToCart = (item: any) => {
    return {
        type: ADD_ITEM_TO_CART,
        payload: item
    }
}

export const removeItemFromCart = (item: any) => {
    return {
        type: REMOVE_ITEM_FROM_CART,
        payload: item 
    }
}