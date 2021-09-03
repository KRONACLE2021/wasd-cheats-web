import { ADD_CATEGORY, SET_CATEGORYS } from "../actions";

const initalState = {
    categorys: [],
    lastUpdated: new Date()
};

export default function categoryReducer(state : any = initalState, action : { type: string, payload: any }) {
    switch(action.type){
        case ADD_CATEGORY: 
            state.categorys.push(action.payload)
            return state;
        case SET_CATEGORYS:
            state.categorys = action.payload;

            return state;
        default: 
            return state;
    }
}