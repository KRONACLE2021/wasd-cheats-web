const development = true;

export const API = development ? "http://localhost:8080" : "https://api.wasdcheats.cc";
export const API_STATUS_CHECK = "api/status";
export const BASE_IMAGE_URL = (id: string) => `${API}/api/v1/uploads/file/${id}`;

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
export const DELETE_POST = (id: string) => `api/v1/posts/delete/${id}`;
export const DELETE_TOPIC = (id: string) => `api/v1/topics/${id}/delete`;
export const REPORT_POST = `api/v1/report/post`;
export const UPDATE_USER_PROFILE = `api/v1/users/me/update`;
export const LOCK_TOPIC = (id: string) => `api/v1/topics/${id}/lock`;
export const UPDATE_SHOP_ITEM = (id: string) => `api/v1/shop/admin/item/${id}/edit`;
export const UPADTE_TOPIC = (id: string) => `api/v1/topics/${id}/edit`;
export const CREATE_CATEGORY = `api/v1/categorys/create`;

/* Store Routes */
export const GET_STORE_ITEMS = `api/v1/shop/items`;
export const GET_STORE_ITEM = (id: string) => `api/v1/shop/items/${id}`; 
export const ADMIN_GET_USER_INCART_ITEMS = `api/v1/shop/admin/users/checkout/incart`;
export const GET_USER_INCART_ITEMS = `api/v1/shop/checkout/order`;
export const ADD_STORE_ITEM = `api/v1/shop/admin/item/add`;
export const ADD_SUBSCRIPTION = `api/v1/shop/admin/subscriptions/add`;
export const GET_SUBSCRIPTIONS = `api/v1/shop/admin/subscriptions/get`;
export const DELETE_SUBSCRIPTIONS = (id: string) => `api/v1/shop/admin/subscription/${id}/delete`;
export const CREATE_NEW_ORDER = `api/v1/shop/checkout/create-order` 
export const GET_PAYPAL_ORDER = `api/v1/shop/checkout/payment/paypal`;
export const CAPTURE_PAYPAL_ORDER = `api/v1/shop/checkout/capture/paypal`;
export const ADMIN_DELETE_SHOP_ITEM = (id: string) => `api/v1/shop/admin/item/${id}/delete`;

/* File upload routes */
export const USER_FILE_UPLOAD = `api/v1/upload/usercontent`;
export const ADMIN_GET_ATTACHMNETS = `api/v1/admin/content/images`;
export const DELETE_ATTACHMENT = (id: string) => `api/v1/admin/content/files/${id}/delete`;
export const MASS_DELETE_ATTACHMENTS_ASSIGNEDCONTENT = `api/v1/admin/content/files/massdelete/assignedcontent`;
export const CREATE_NEW_DOWNLOAD = `api/v1/downloads/create`;
export const GET_ALL_DOWNLOADS = `api/v1/downloads/get/all`;
export const EDIT_DOWNLOAD = (id: string) => `api/v1/downloads/${id}/edit`;
export const RELEASE_NEW_DOWNLOAD = `api/v1/downloads/upload`;
export const INITATE_PROTECTED_DOWNLOAD = (id: string, version: string) => `api/v1/downloads/${id}/${version}`;

/* USER ROUTES */
export const GET_CURRENT_USER = `api/v1/users/me`;
export const GET_USER_POSTS = (id: string) => `api/v1/users/${id}/posts`;
export const GET_USERS = `api/v1/users/admin/users`;
export const BAN_USER = (id: string) =>  `api/v1/users/${id}/ban`;