import { combineReducers } from "redux";
import categoryReducer from "./categoryReducer";

import topicReducer from "./topicReducer";
import userReducer from "./userReducer";
import threadReducer from "./threadReducer";

export default combineReducers({
    user: userReducer,
    topics: topicReducer,
    categorys: categoryReducer,
    threads: threadReducer
});