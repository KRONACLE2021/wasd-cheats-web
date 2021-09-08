import { ADD_THREADS, CREATE_THREAD, SET_THREAD_OWNER } from '../actions';

const initalState = {
    threads: [],
    lastUpdated: new Date()
}

function filterDuplicates<T>(array: T[], areEqual: ((a: T, b: T) => boolean)): T[] {
    return array.filter((item: T, pos: number) => {
      return array.findIndex((other: T) => areEqual(item, other)) == pos;
    });
}

export default function threadReducer(state : any = initalState, action: { type: string, payload: any }) {
    switch(action.type) {
        case ADD_THREADS:
            let threads = action.payload;

            //check if threads is an array

            
            if(threads.length) {
                state.threads = state.threads.concat(threads); 
            } else {
                state.threads.append(threads);
            }

            state.threads = filterDuplicates(state.threads, (a, b) => a.id == b.id);

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