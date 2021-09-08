import { API, FETCH_TOPIC, FETCH_TOPICS_BY_CATEGORY } from '../../requests/config';
import Requester from '../../requests/Requester';

import { ADD_CATEGORY, ADD_TOPIC, SET_CATEGORYS, SET_TOPICS } from "../actions"

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