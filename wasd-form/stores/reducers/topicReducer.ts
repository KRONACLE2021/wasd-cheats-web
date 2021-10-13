import { ADD_TOPIC, DELETE_TOPIC_FAILED, DELETE_TOPIC_PENDING, DELETE_TOPIC_SUCCESS, FETCH_TOPICS_FAILED, FETCH_TOPICS_PENDING, FETCH_TOPICS_SUCCESS, LOCK_TOPIC_FAILED, LOCK_TOPIC_PENDING, LOCK_TOPIC_SUCCESS, REMOVE_TOPIC, SET_TOPICS, SET_TOTAL_THREADS } from "../actions";

const initalState = {
    topics: [],
    loading: true,
    error: false,
    errors: [],
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
                state.topics.push(action.payload);
            }
            return state;
        case FETCH_TOPICS_PENDING:
            state.loading = true;
            return state;
        case FETCH_TOPICS_SUCCESS:
            state.topics.push(action.payload);
            state.loading = false;
            return state;
        case FETCH_TOPICS_FAILED:
            state.loading = false;
            state.error = true;
            state.errors = action.payload;
            return state;
        case REMOVE_TOPIC:
            for(var i in state.topics) {
                if(state.topics[i].id == action.payload){
                    state.topics[i] = null;
                }
            }
            return state;
        case DELETE_TOPIC_PENDING:
            state.loading = true;
            return state;
        case DELETE_TOPIC_FAILED:
            state.loading = false;
            state.errors = action.payload;
            return state;
        case DELETE_TOPIC_SUCCESS:
            state.loading = false;
            for(var i in state.topics) {
                if(state.topics[i].id == action.payload){
                    state.topics[i] = null;
                }
            }
            return state;
        case LOCK_TOPIC_PENDING:
            state.loading = true;
            return state;
        case LOCK_TOPIC_SUCCESS:
            state.loading = false;
            for(var i in state.topics) {
                if(state.topics[i].id == action.payload.id){
                    state.topics[i] = action.payload;
                }
            }
            return state;
        case LOCK_TOPIC_FAILED:
            state.loading = true;
            return state;
        default:
            return state;
    }
}