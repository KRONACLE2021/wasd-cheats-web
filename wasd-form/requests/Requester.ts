/* 
    Makes API Requests and deals with api errors such as the api server being offline 
*/

import axios from 'axios';


export default class Requester {

    BASE_URL: string;

    constructor(BASE_URL: string){
        this.BASE_URL = BASE_URL;
    }

    async makeGetRequest(url: string, options: { queryStringParams: Array<{ name: string, value: string | number }>, headers: any  } = { queryStringParams: [], headers: {}}) {
        
        let queryStringParams = options.queryStringParams ? options.queryStringParams.join("&") : "";
        
        let result = await axios.get(`${this.BASE_URL}/${url}?${queryStringParams}`, {
            headers: options.headers
        }).then(res => res.data)
        .catch((err) => {
            if(!err.response.status) {
                return { error: true, errors: ["Could not contact WASD API"] }
            } else {
                return err.response.data;
            }
        });

        return result;
    } 

    async makePostRequest(url: string, body: any, options : { queryStringParams: Array<{ name: string, value: string | number }>, headers: any  }){

        let queryStringParams = options.queryStringParams ? options.queryStringParams.join("&") : "";

        let result = await axios.post(`${this.BASE_URL}/${url}?${queryStringParams}`, body, {
            headers: options.headers
        }).then(res => res.data)
        .catch((err) => {
            if(!err.response.status) {
                return { error: true, errors: ["Could not contact WASD API"] }
            } else {
                return err.response.data;
            }
        });

        return result;
    }

    changeBaseURL(base: string) {
        this.BASE_URL = base;
    }
}
