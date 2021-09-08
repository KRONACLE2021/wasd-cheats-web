import { ADD_POSTS, CREATE_POST, SET_POST_OWNER } from "../actions";
import filterDuplicates from '../../utils/filterDuplicates';

const initalState = {
    posts: [],
    lastUpdated: new Date()
};

export default function categoryReducer(state : any = initalState, action : { type: string, payload: any }) {
    switch(action.type){
        case ADD_POSTS:
            let posts = action.payload;

            if(posts.length){
                state.posts = state.posts.concat(posts); 
            } else {
                state.posts.push(posts);
            }

            state.posts = filterDuplicates(state.posts, (a, b) => a.id == b.id);
            
            return state;

        case CREATE_POST:
            let post = action.payload;

            state.posts.push(post);

            return state;

        case SET_POST_OWNER:
            let postId = action.payload.post_id;
            let filteredPost = state.posts.filter((t) => (t["id"] == postId))[0];
            if(!filteredPost) return;

            console.log(state.posts);

            let modifiedPost = filteredPost;
            modifiedPost.user = action.payload.user;
            state.posts[state.posts.indexOf(filteredPost)] = modifiedPost;
        
            return state;
        default: 
            return state;
    }
}