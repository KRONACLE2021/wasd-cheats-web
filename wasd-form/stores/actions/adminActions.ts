import Requester from "../../requests/Requester";
import { 
    ADMIN_GET_ATTACHMNETS,
    ADMIN_GET_USER_INCART_ITEMS,
    API,
    DELETE_SUBSCRIPTIONS,
    GET_ALL_DOWNLOADS,
    GET_SUBSCRIPTIONS,
    UPDATE_SHOP_ITEM
} from '../../requests/config';
import { Dispatch } from "react";
import { 
    ADMIN_GET_INCART_ITEMS_FAILED,
    ADMIN_GET_INCART_ITEMS_PENDING, 
    ADMIN_GET_INCART_ITEMS_SUCCESS, 
    ADMIN_UPDATE_PRODUCT_FAILED, 
    ADMIN_UPDATE_PRODUCT_PENDING, 
    ADMIN_UPDATE_PRODUCT_SUCCESS, 
    APPEND_SHOP_SUBSCRIPTIONS, 
    DELETE_SUBSCRIPTION_ITEM_FAILED, 
    DELETE_SUBSCRIPTION_ITEM_PENDING, 
    DELETE_SUBSCRIPTION_ITEM_SUCCESS, 
    FETCH_DOWNLODAS_FAILED, 
    GET_ATTACHMENTS_FAILED, 
    GET_ATTACHMENTS_PENDING, 
    GET_ATTACHMENTS_SUCCESS, 
    GET_SHOP_SUBSCRIPTIONS_FAILED, 
    GET_SHOP_SUBSCRIPTIONS_PENDING, 
    REMOVE_ATTACHMENT, 
    SET_DOWNLOADS, 
    SET_SHOP_SUBSCRIPTIONS
} from "../actions";

const Requester_ = new Requester(API);

const getUsersIncartItemsPending = () => {
    return {
        type: ADMIN_GET_INCART_ITEMS_PENDING
    }
}

const getUsersIncartItemsSuccess = (amount: string, orders: any) => {
    return {
        type: ADMIN_GET_INCART_ITEMS_SUCCESS,
        payload: {
            in_cart: amount,
            orders
        }
    }
}

const getUsersIncartItemsFailed = (error: any) => {
    return {
        type: ADMIN_GET_INCART_ITEMS_FAILED,
        payload: error
    }
}

export const getUsersIncartItems = (api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(getUsersIncartItemsPending());

        Requester_.makeGetRequest(ADMIN_GET_USER_INCART_ITEMS, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.error){
                dispatcher(getUsersIncartItemsSuccess(res.in_cart, res.orders));
            } else {
                dispatcher(getUsersIncartItemsFailed(res.error));
            }
        }).catch((err) => {
            dispatcher(getUsersIncartItemsFailed(err));
        });
    }
};

export const setShopSubscriptions = (subscriptions: Array<any>) => {
    return {
        type: SET_SHOP_SUBSCRIPTIONS,
        payload: subscriptions
    };
}

export const getShopSubscriptionsPending = () => {
    return {
        type: GET_SHOP_SUBSCRIPTIONS_PENDING
    }
}

export const getShopSubscriptionsFailed = (err: any) => {
    return {
        type: GET_SHOP_SUBSCRIPTIONS_FAILED,
        payload: err
    }
}

export const getShopSubscriptions = (api_key: string) => {
    
    return (dispatcher: Dispatch<any>) => {
        dispatcher(getShopSubscriptionsPending());
        Requester_.makeGetRequest(GET_SUBSCRIPTIONS, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.error) {
                dispatcher(setShopSubscriptions(res.subscriptions));
            } else {
                dispatcher(getShopSubscriptionsFailed(res.errors));
            }
        }).catch((err) => {
            dispatcher(getShopSubscriptionsFailed(err));
        });

    }
}

export const appendShopSubscriptions = (subscription: any) => {
    return {
        type: APPEND_SHOP_SUBSCRIPTIONS,
        payload: subscription
    }
}

const deleteSubscriptionItemPending = () => {
    return {
        type: DELETE_SUBSCRIPTION_ITEM_PENDING
    }
} 

const deleteSubscriptionItemFailed = (errors: Array<any>) => {
    return {
        type: DELETE_SUBSCRIPTION_ITEM_FAILED,
        payload: errors
    }
}

const deleteSubscriptionItemSuccess = (id: string) => {
    return {
        type: DELETE_SUBSCRIPTION_ITEM_SUCCESS,
        payload: id
    }
}

export const deleteSubscriptionItem = (id: string, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(deleteSubscriptionItemPending());
        Requester_.makePostRequest(DELETE_SUBSCRIPTIONS(id), {}, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.error){
                dispatcher(deleteSubscriptionItemSuccess(id));
            } 
        }).catch((err) => {
            dispatcher(deleteSubscriptionItemFailed(err));
        })
    }   
}

const updateProductPending = () => {
    return {
        type: ADMIN_UPDATE_PRODUCT_PENDING
    }
}


const updateProductFailed = (err: Array<string>) => {
    return {
        type: ADMIN_UPDATE_PRODUCT_FAILED,
        payload: err
    }
}


const updateProductSuccess = (product: any) => {
    return {
        type: ADMIN_UPDATE_PRODUCT_SUCCESS,
        payload: product
    }
}

export const AdminUpdateProduct = ({name, stock, price, imgID, description, subscription_id} : any, id: string, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(updateProductPending());

        Requester_.makePostRequest(UPDATE_SHOP_ITEM(id), {
            name,
            stock,
            price,
            imgID,
            description,
            subscription: subscription_id
        }, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            if(!res.error) {
                dispatcher(updateProductSuccess(res.item));
            } else {
                dispatcher(updateProductFailed(res.errors));
            }
        })
    }
}

const adminGetAttachmentsFailed = (err: any) => {
    return {
        type: GET_ATTACHMENTS_FAILED,
        payload: err
    }
}

const adminGetAttachmentsPending = () => {
    return {
        type: GET_ATTACHMENTS_PENDING
    }
}

const adminGetAttachmentsSuccess = (attachments: Array<any>) => {
    return {
        type: GET_ATTACHMENTS_SUCCESS,
        payload: attachments
    }
}

export const AdminGetAttachments = (skip: number, limit: number, api_key : string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(adminGetAttachmentsPending());
        Requester_.makeGetRequest(ADMIN_GET_ATTACHMNETS, {
            queryStringParams: [
                {
                    name: "skip",
                    value: skip
                },
                {
                    name: "limit",
                    value: limit
                },
            ],
            headers: {  
                Authorization: api_key 
            }
        }).then(res => {
            if(res.error) {
                dispatcher(adminGetAttachmentsFailed(res.errors));
            } else  {
                dispatcher(adminGetAttachmentsSuccess(res.content));
            }
        }).catch(err => {
            dispatcher(adminGetAttachmentsFailed(err.errors));
        });
    }
}

export const RemoveAttachment = (id: string) => {
    return {
        type: REMOVE_ATTACHMENT,
        payload: id,
    }
}

export const AdminGetAllDownloads = (api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        Requester_.makeGetRequest(GET_ALL_DOWNLOADS, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then((res) => {
            dispatcher({
                type: SET_DOWNLOADS,
                payload: res.downloads
            });
        }).catch((err) => {
            dispatcher({ 
                type: FETCH_DOWNLODAS_FAILED,
                payload: err.errors
            })
        });
    }
}