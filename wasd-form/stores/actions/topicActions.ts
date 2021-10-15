import { Dispatch } from 'redux';
import { API, CREATE_NEW_TOPIC, DELETE_TOPIC, FETCH_TOPIC, FETCH_TOPICS_BY_CATEGORY, LOCK_TOPIC, UPADTE_TOPIC } from '../../requests/config';
import Requester from '../../requests/Requester';

import { ADD_CATEGORY, ADD_TOPIC, APPEND_TOPICS, CREATE_TOPICS, DELETE_TOPIC_FAILED, DELETE_TOPIC_PENDING, DELETE_TOPIC_SUCCESS, EDIT_TOPIC_PENDING, EDIT_TOPIC_SUCCESS, FETCH_TOPICS_FAILED, FETCH_TOPICS_PENDING, FETCH_TOPICS_SUCCESS, LOCK_TOPIC_FAILED, LOCK_TOPIC_PENDING, LOCK_TOPIC_SUCCESS, SET_CATEGORYS, SET_TOPICS, TOPIC_CREATE_ERROR } from "../actions"

const Requester_ = new Requester(API);

export const SetTopics = (topic : Array<any>) => {
    return {
        type: SET_TOPICS,
        payload: topic
    }
}

export const FetchTopicsPending = () => {
    return {
        type: FETCH_TOPICS_PENDING
    }
}

export const FetchTopicsSuccess = (topic: Array<any>) => {
    return {
        type: FETCH_TOPICS_SUCCESS,
        payload: topic
    }
}

export const FetchTopicsFailed = (errors: Array<string>) => {
    return {
        type: FETCH_TOPICS_FAILED,
        payload: errors
    }
}

export const FetchTopicById = (id : string) => {

    let id_ = id;

    return (dispatcher: Dispatch<any>) => {
        
        dispatcher(FetchTopicsPending());

        Requester_.makeGetRequest(FETCH_TOPIC(id_)).then((res) => {
            if(!res.error) {
                dispatcher(FetchTopicsSuccess(res));
            } else {
                dispatcher(FetchTopicsFailed(res.errros));   
            }
        }).catch((err) => {
            dispatcher(FetchTopicsFailed(err));
        });
    }
}

export const CreateTopic = (data: { title: string, description: string, attachmentId: string, category: string }, api_key: string) => {
    
    return (dispatcher: Dispatch<any>) => {
        Requester_.makePostRequest(CREATE_NEW_TOPIC, data, {
            headers: {
                authorization: api_key
            },
            queryStringParams: []
        }).then(res => {
            if(!res.error){
                dispatcher({
                    type: ADD_TOPIC,
                    payload: res
                })
            } else {
                dispatcher({ 
                    type: TOPIC_CREATE_ERROR,
                    payload: res.errors
                })
            }
        }).catch(err => {
            dispatcher({ 
                type: TOPIC_CREATE_ERROR,
                payload: err.errors
            }) 
        });

    }
}

export const FetchTopicsByCategory = async (id : string, dispatcher : any) => {
    
    let result = await Requester_.makeGetRequest(FETCH_TOPICS_BY_CATEGORY(id))

    if(!result.error){
        if(result.topics){
            dispatcher({
                type: APPEND_TOPICS,
                payload: result.topics
            });

            return result.topics;
        }
    } else {
        return result.errors;
    }

}

const deleteTopicPending = () => {
    return {
        type: DELETE_TOPIC_PENDING
    }
}


const deleteTopicFailed = (errors: Array<string>) => {
    return {
        type: DELETE_TOPIC_FAILED,
        payload: errors
    }
}


const deleteTopicSuccess = (id: string) => {
    return {
        type: DELETE_TOPIC_SUCCESS,
        payload: id
    }
}

export const AdminDeleteTopic = (id: string, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(deleteTopicPending());

        Requester_.makePostRequest(DELETE_TOPIC(id), {}, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then(res => {
            if(!res.error){
                dispatcher(deleteTopicSuccess(id));
            } else {
                dispatcher(deleteTopicFailed(res.errors));
            }
        }).catch(err => {
            dispatcher(deleteTopicFailed(err));
        });
    }
}

export const lockTopicPending = () => {
    return {
        type: LOCK_TOPIC_PENDING
    }
}

export const lockTopicSuccess = (topic: any) => {
    return {
        type: LOCK_TOPIC_SUCCESS,
        payload: topic
    }
}

export const lockTopicFailed = (errors: Array<string>) => {
    return {
        type: LOCK_TOPIC_FAILED,
        payload: errors
    }
}

export const AdminLockTopic = (id: string, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(lockTopicPending());
        console.log(LOCK_TOPIC(id));
        Requester_.makePostRequest(LOCK_TOPIC(id), "", {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then(res => {
            if(!res.error){
                dispatcher(lockTopicSuccess(res.topic));
            } else {
                dispatcher(lockTopicFailed(res.errors));
            }
        }).catch(err =>  {
            dispatcher(lockTopicFailed(err.errors))
        });

    }
}


const editTopicPending = () => {
    return {
        type: EDIT_TOPIC_PENDING
    }
}


const editTopicSuccess = (topic: any) => {
    return {
        type: EDIT_TOPIC_SUCCESS,
        payload: topic
    }
}

const editTopicFailed = (err: Array<string>) => {
    return {
        type: EDIT_TOPIC_PENDING,
        payload: err
    }
}

export const AdminEditTopic = ({ title, description, icon } : any, id: string, api_key: string) => {
    return (dispatcher: Dispatch<any>) => {
        dispatcher(editTopicPending())
        Requester_.makePostRequest(UPADTE_TOPIC(id), {
            title,
            description,
            imgID: icon
        }, {
            queryStringParams: [],
            headers: {
                Authorization: api_key
            }
        }).then(res => {
            if(!res.error) {
                dispatcher(editTopicSuccess(res.topic));
            } else {
                dispatcher(editTopicFailed(res.errors));
            }
        }).catch((err) => {
            dispatcher(editTopicFailed(err.errors));
        })
    }
}