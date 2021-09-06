import { ADD_THREADS, CREATE_THREAD } from '../actions';

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
                console.log(threads);
                state.threads.concat(threads); 
            } else {
                state.threads.append(threads);
            }

            return state;
        case CREATE_THREAD: 
            let thread = action.payload;

            state.threads.append(thread);
            
            return state;
        default:
            return state;
    }
}