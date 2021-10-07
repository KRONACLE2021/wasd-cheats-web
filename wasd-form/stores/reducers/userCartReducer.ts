import filterDuplicates from "../../utils/filterDuplicates";
import {  } from "../actions";

const initalState = {
    loading: false,
    items: [],
    isCheckingOut: false
};

export default function shopItemsReducer(state : any = initalState, action : { type: string, payload: any }) {
    switch(action.type){
       
        default: 
            return state;
    }
}