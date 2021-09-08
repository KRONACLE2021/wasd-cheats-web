import { combineReducers } from "redux";
import categoryReducer from "./categoryReducer";

import topicReducer from "./topicReducer";
import userReducer from "./userReducer";
import postsReducer from './postsReducer';
import threadReducer from "./threadReducer";

export default combineReducers({
    user: userReducer,
    topics: topicReducer,
    categorys: categoryReducer,
    postStore: postsReducer,
    threadStore: threadReducer
});