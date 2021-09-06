import { ADD_THREADS} from '../actions';

const initalState = {
    threads: [],
    lastUpdated: new Date()
}

export default function threadReducer(state : any = initalState, action: { type: string, payload: any }) {
    switch(action.type) {
        case ADD_THREADS:
            let threads = action.payload;

            //check if threads is an array
            if(threads.length) {
                state.threads.concat(threads); 
            } else {
                state.threads.append(threads);
            }

            return threads;
        default:
            return state;
    }
}