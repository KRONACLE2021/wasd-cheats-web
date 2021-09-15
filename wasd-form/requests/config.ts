const development = true;


export const API = development ? "http://localhost:8080" : "https://api.wasdcheats.cc";
export const API_STATUS_CHECK = "api/status";

/* AUTH ROUTES */
export const REGISTER_ROUTE = "api/v1/auth/register";
export const LOGIN_ROUTE = "api/v1/auth/login";

/* FOURM ROUTES */
export const FETCH_TOPIC = (id : string) => `api/v1/topics/${id}`;
export const FETCH_TOPICS_BY_CATEGORY = (categoryId: string) => `api/v1/categorys/${categoryId}/topics`;
export const FETCH_CATEGORYS = `api/v1/categorys/all`;
export const CREATE_NEW_THREAD = `api/v1/threads/create`;
export const FETCH_THREADS = (topic_id: string) =>  `api/v1/topics/${topic_id}/threads`;
export const FETCH_USER = (id: string) => `api/v1/users/${id}`;
export const FETCH_THREAD = (id: string) => `api/v1/threads/${id}`;
export const FETCH_POSTS_BY_THREAD = (thread_id: string) => `api/v1/threads/${thread_id}/posts`;
export const CREATE_NEW_POST = `api/v1/posts/create`
export const CREATE_NEW_TOPIC = `api/v1/topics/create`;

/* USER ROUTES */
export const GET_CURRENT_USER = `api/v1/users/me`;
