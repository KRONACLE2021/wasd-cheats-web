import { ADD_POSTS, CREATE_POST, SET_POST_OWNER, POST_DELETE } from "../actions";
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

            let modifiedPost = filteredPost;
            modifiedPost.user = action.payload.user;
            state.posts[state.posts.indexOf(filteredPost)] = modifiedPost;
        
            return state;
       
        case POST_DELETE: 
            let filteredPost_ = state.posts.filter((t) => (t["id"] == action.payload.post_id))[0];
            let postIndex = state.posts.indexOf(filteredPost_);

            console.log(postIndex);

            if(!filteredPost_) return state;

            state.posts.splice(postIndex, 1);

            return state;

        default: 
            return state;
    }
}

