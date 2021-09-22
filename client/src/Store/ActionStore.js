import _ from 'lodash';
import {observable, makeAutoObservable, action} from 'mobx'
import {WsCode} from '../helper/Wscode'
import {CONFIG_URL} from "../helper/constant"
import {Request} from "../helper/Request"
export class ActionStore {
    

    constructor() {
        makeAutoObservable(this, {
            action_getProfile: action,
            action_getPost: action,
            action_getPostTimeLine: action,
            action_getListFriend: action,
        })
    }

    async action_getProfile(userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getProfile}`;
        const result = await Request.get({userId}, DOMAIN);
        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return null;
        }
    }

    async action_getPost(userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getPost}/${userId}`;
        console.log(DOMAIN);
        const result = await Request.get({}, DOMAIN);
        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return null;
        }
    }

    async action_getPostTimeLine(userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getPostTimeLine}/${userId}`;
        const result = await Request.get({}, DOMAIN);
        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return null;
        }
    }

    async action_getListFriend(userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getListFriend}/${userId}`

        const result = await Request.get({}, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return [];
        }
    }

    async action_getConversation(userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getConversation}/${userId}`;

        const result = await Request.get({}, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return [];
        }
    }

    async action_getAllMessageOfConversation(ConversationId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getAllMessageOfConversation}/${ConversationId}`;

        const result = await Request.get({}, DOMAIN);
        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return [];
        }

    }
}