import axios from 'axios';
import { API, FETCH_TOPIC, FETCH_TOPICS_BY_CATEGORY } from '../../requests/config';

import { ADD_CATEGORY, ADD_TOPIC, SET_CATEGORYS, SET_TOPICS } from "../actions"

export const SetTopics = (topic : Array<any>) => {
    return {
        type: SET_TOPICS,
        payload: topic
    }
}

export const FetchTopicById = async (id : string, dispatcher : any ) => {
    let result = await axios.get(`${API}/${FETCH_TOPIC(id)}`)
    .then((res) => res)
    .catch((err) => err.response);

    if(!result.data.error) {
        if(result.data.id){
            dispatcher({
                type: ADD_TOPIC,
                payload: result.data
            })
            
            return result.data;
        }
    } else {
        return result.data;
    }
}

export const FetchTopicsByCategory = async (id : string, dispatcher : any) => {
    
    let result = await axios.get(`${API}/${FETCH_TOPICS_BY_CATEGORY(id)}`)
    .then((res) => res)
    .catch((err) => err.response);

    if(!result.data.error){
        if(result.data.topics){
            dispatcher({
                type: SET_TOPICS,
                payload: result.data.topics
            });

            return result.data.topics;
        }
    } else {
        return result.data.errors;
    }

}