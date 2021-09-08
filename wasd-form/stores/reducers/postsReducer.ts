import {  } from "../actions";

const initalState = {
    posts: [],
    lastUpdated: new Date()
};

export default function categoryReducer(state : any = initalState, action : { type: string, payload: any }) {
    switch(action.type){
        default: 
            return state;
    }
}