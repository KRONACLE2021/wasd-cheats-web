import { API, CREATE_NEW_TOPIC, FETCH_TOPIC, FETCH_TOPICS_BY_CATEGORY } from '../../requests/config';
import Requester from '../../requests/Requester';

import { ADD_CATEGORY, ADD_TOPIC, CREATE_TOPICS, SET_CATEGORYS, SET_TOPICS } from "../actions"

const Requester_ = new Requester(API);

export const SetTopics = (topic : Array<any>) => {
    return {
        type: SET_TOPICS,
        payload: topic
    }
}

export const FetchTopicById = async (id : string, dispatcher : any ) => {
    let result = await Requester_.makeGetRequest(FETCH_TOPIC(id));

    if(!result.error) {
        if(result.id){
            dispatcher({
                type: ADD_TOPIC,
                payload: result
            })
            
            return result;
        }
    } else {
        return result;
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