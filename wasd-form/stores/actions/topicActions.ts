import { API, CREATE_NEW_TOPIC, FETCH_TOPIC, FETCH_TOPICS_BY_CATEGORY } from '../../requests/config';
import Requester from '../../requests/Requester';

import { ADD_CATEGORY, ADD_TOPIC, CREATE_TOPICS, FETCH_TOPICS_FAILED, FETCH_TOPICS_PENDING, FETCH_TOPICS_SUCCESS, SET_CATEGORYS, SET_TOPICS } from "../actions"

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

    return (dispatcher) => {
        
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

export const CreateTopic = async (data: { name: string, description: string, imgUrl: string}, api_key: string, dispatcher: any) => {
    let res = await Requester_.makePostRequest(CREATE_NEW_TOPIC, {
        data
    }, {
        headers: {
            authorization: api_key
        },
        queryStringParams: []
    });

    if(!res.error){
        console.log(res);
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