import { combineReducers } from "redux";
import categoryReducer from "./categoryReducer";

import topicReducer from "./topicReducer";
import userReducer from "./userReducer";

export default combineReducers({
    user: userReducer,
    topics: topicReducer,
    categorys: categoryReducer
});