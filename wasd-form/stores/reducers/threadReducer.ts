import { ADD_THREADS, CREATE_THREAD } from '../actions';

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

            state.threads.append(thread);
            
            return state;
        default:
            return state;
    }
}