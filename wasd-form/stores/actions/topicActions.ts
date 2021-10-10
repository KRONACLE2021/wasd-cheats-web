import { Dispatch } from 'redux';
import { API, CREATE_NEW_TOPIC, DELETE_TOPIC, FETCH_TOPIC, FETCH_TOPICS_BY_CATEGORY } from '../../requests/config';
import Requester from '../../requests/Requester';

import { ADD_CATEGORY, ADD_TOPIC, CREATE_TOPICS, DELETE_TOPIC_FAILED, DELETE_TOPIC_PENDING, DELETE_TOPIC_SUCCESS, FETCH_TOPICS_FAILED, FETCH_TOPICS_PENDING, FETCH_TOPICS_SUCCESS, SET_CATEGORYS, SET_TOPICS } from "../actions"

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

export const CreateTopic = (data: { name: string, description: string, attachmentId: string, category: string }, api_key: string) => {
    
    return (dispatcher: Dispatch<any>) => {
        let res = Requester_.makePostRequest(CREATE_NEW_TOPIC, data, {
            headers: {
                authorization: api_key
            },
            queryStringParams: []
        }).then(res => {
            console.log(res);
        });
    
        if(!res.error){
            console.log(res);
        }
    }
}

export const FetchTopicsByCategory = async (id : string, dispatcher : any) => {
    
    let result = await Requester_.makeGetRequest(FETCH_TOPICS_BY_CATEGORY(id))

    if(!result.error){
        if(result.topics){
            dispatcher({
                type: SET_TOPICS,
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