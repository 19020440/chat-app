import _ from 'lodash';
import {observable, makeAutoObservable, action} from 'mobx'
import {WsCode} from '../helper/Wscode'
import {CONFIG_URL} from "../helper/constant"
import {Request} from "../helper/Request"
import {getLessProfile} from '../helper/function';
export class ActionStore {
    
    profileOfFriend = {};
    posts = [];
    statusPost = false;
    listSearch = [];

    constructor() {
        makeAutoObservable(this, {
            profileOfFriend: observable,
            listSearch: observable,
            statusPost:observable,
            possts: observable,
            action_getProfile: action,
            action_getPost: action,
            action_getPostTimeLine: action,
            action_getListFriend: action,
            action_savePost: action,
            action_setPosts: action,
            action_setStatusPost: action,
            action_searchFriend: action,
            action_getCovBySearch: action,

        })
    }

    action_setStatusPost() {
        this.statusPost = !this.statusPost;
    }
    action_setPosts(data) {
        this.posts = [...data,...this.posts];
    }

    async action_setProfileOfFriend(data) {
        this.profileOfFriend = data;
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

    async action_saveMessage(data) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getAllMessageOfConversation}`;

        const result = await Request.post(data, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return [];
        }

    }


    async action_savePost(data) {

        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.savePost}`;

        const result = await Request.post(data, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return [];
        }


    }

    async action_upload(data) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.upload}`;

        const result = await Request.post(data, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return [];
        }
    }

    async action_searchFriend(data) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.searchFriend}`;
        const json = {
            "word": data,
        }
        const result = await Request.post(json, DOMAIN);
        if(result) {
            if(!_.isEmpty(result.content)) {
                const res = getLessProfile(result.content);
                this.listSearch = res;
                return res;
            }
            else return [];
        }
    }

    async action_getCovBySearch(userId, searchUserId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.searchCov}/${userId}/${searchUserId}`;

        const result = await Request.get({}, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            else return {};
        }
    }
}