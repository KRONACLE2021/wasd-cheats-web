import { createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers';

const initState = {};

const store = createStore(
    rootReducer,
    initState,
    composeWithDevTools()
);

export default store;
