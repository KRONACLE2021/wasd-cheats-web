import { ADD_THREADS, CREATE_THREAD, SET_THREAD_OWNER } from '../actions';
import filterDuplicates from '../../utils/filterDuplicates';

const initalState = {
    threads: [],
    lastUpdated: new Date(),
    total: 0
}


export default function threadReducer(state : any = initalState, action: { type: string, payload: any }) {
    switch(action.type) {
        case ADD_THREADS:
            let threads = action.payload.threads || action.payload;
            let total = action.payload.amount || 0;
            //check if threads is an array

            
            if(threads.length) {
                state.threads = state.threads.concat(threads); 
            } else {
                state.threads.push(threads);
            }

            state.threads = filterDuplicates(state.threads, (a, b) => a.id == b.id);
            state.total = total;

            return state;
            
        case CREATE_THREAD: 
            let thread = action.payload;

            state.threads.push(thread);
            
            return state;
        
        case SET_THREAD_OWNER: 

            //im sure theres a better way of doing this but im kinda lazy so this is fine.
            let threadId = action.payload.thread_id;

            let filteredThread = state.threads.filter((t) => (t["id"] == threadId))[0];

            if(!filteredThread) return state;

            let modifiedThread = filteredThread;

            modifiedThread.user = action.payload.user;

            state.threads[state.threads.indexOf(filteredThread)] = modifiedThread;
            return state;

        default:
            return state;
    }
}