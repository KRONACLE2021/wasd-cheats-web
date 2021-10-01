/* User Reducer Actions */
export const SET_USER = "SET_USER";
export const UNSET_USER = "REMOVE_USER";
export const FETCH_USER = "FETCH_USER";
export const FETCH_USER_PENDING = "FETCH_USER_PENDING";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS"; 
export const FETCH_USER_POSTS_PENDING = "FETCH_USER_POSTS_PENDING";
export const FETCH_USER_POSTS_SUCCESS = "FETCH_USER_POSTS_SUCCESS";

/* FOURM TOPIC ACTIONS */
export const ADD_TOPIC = "ADD_TOPIC";
export const REMOVE_TOPIC = "REMOVE_TOPIC";
export const SET_TOPICS = "SET_TOPICS";
export const CREATE_TOPICS = "CREATE_TOPICS";
export const FILTER_TOPICS = "FILTER_TOPICS";
export const FETCH_TOPICS_PENDING = "FETCH_TOPICS_PENDING";
export const FETCH_TOPICS_SUCCESS = "FETCH_TOPICS_SUCCESS";
export const FETCH_TOPICS_FAILED = "FETCH_TOPICS_FAILED";

/* FOURM CATEGORY ACTIONS */
export const ADD_CATEGORY = "ADD_CATEGORY";
export const SET_CATEGORYS = "SET_CATEGORYS";

/* FOURM THREAD ACTIONS */
export const ADD_THREADS = "ADD_THREADS";
export const CREATE_THREAD = "CREATE_THREAD";
export const FETCH_THREADS = "FETCH_THREADS";
export const SET_THREAD_OWNER = "SET_THREAD_OWNER";
export const SET_THREAD_POST = "SET_THERAD_POST";
export const SET_TOTAL_THREADS = "SET_TOTAL_THREADS";
export const FETCH_THREADS_PENDING = "FETCH_THREADS_PENDING";
export const FETCH_THREADS_SUCCESS = "FETCH_THREADS_SUCCESS";
export const FETCH_THREADS_FAILED = "FETCH_THREADS_FAILED";

/* FOURM POSTS ACTIONS */
export const ADD_POSTS = "ADD_POSTS";
export const CREATE_POST = "CREATE_POST";
export const POST_DELETE = "DELETE_POST";
export const SET_POST_OWNER = "SET_POST_OWNER";

/* ADMIN ACTIONS */
export const ADMIN_DELETE_THREAD = "ADMIN_DELETE_THREAD";
export const ADMIN_PIN_THREAD = "ADMIN_PIN_THREAD";
export const ADMIN_LOCK_THREAD = "ADMIN_LOCK_THREAD";
export const ADMIN_DELETE_POST = "ADMIN_DELETE_POST";

/* TEXT EDITOR ACTIONS */
export const SET_TEXT_EDITOR_STATE = "SET_TEXT_EDITOR_STATE";
export const SPAWN_NEW_INSTANCE = "SPAWN_NEW_INSTACE";
export const QUOTE_USER = "QUOTE_USER";
export const CLEAR_TEXT_EDITOR = "CLEAR_TEXT_EDITOR";
export const FOCUS_EDITOR = "FOCUS_EDITOR";

/* SHOP ROUTES */
export const SET_SHOP_ITEMS = "SET_SHOP_ITEMS";
export const GET_ITMES_PENDING = "GET_ITEMS_PENDING";
export const GET_ITEMS_FAILED = "GET_ITEMS_FAILED";