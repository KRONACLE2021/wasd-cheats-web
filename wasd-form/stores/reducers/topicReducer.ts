import { ADD_TOPIC, REMOVE_TOPIC, SET_TOPICS } from "../actions";

const initalState = {
    topics: [],
    lastUpdated: new Date()
};

export default function topicReducer(state : any = initalState, action : { type: string, payload: any}) {
    switch(action.type){
        case SET_TOPICS:
            state.topics = action.payload;
            return state;
        case ADD_TOPIC:
            //check for duplicate topics, if there is a dupe topic then replace it with the updated data.
            if(state.topics.filter((t) => t.id === action.payload.id).length == 1) {
                state.topics[state.topics.indexOf(action.payload)] = action.payload;
            } else {
                console.log("hello");
                state.topics.push(action.payload);
            }
            return state;
            
        case REMOVE_TOPIC:
            for(var i in state.topics) {
                if(state.topics[i].id == action.payload){
                    state.topics[i] = null;
                }
            }
            return state;
        default:
            return state;
    }
}