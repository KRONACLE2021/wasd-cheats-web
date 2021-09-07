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

/* USER ROUTES */
export const GET_CURRENT_USER = `api/v1/users/me`;
