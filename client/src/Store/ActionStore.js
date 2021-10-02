import _ from 'lodash';
import {observable, makeAutoObservable, action} from 'mobx'
import {WsCode} from '../helper/Wscode'
import {CONFIG_URL} from "../helper/constant"
import {Request} from "../helper/Request"
import {getLessProfile, countTextNotSeen,findIndexFromArrayLodash,sortConversationByUpdateAt} from '../helper/function';
export class ActionStore {
    
    profileOfFriend = {};
    posts = [];
    statusPost = false;
    listSearch = [];
    lastText = [];
    offlineStatus = false;
    conversations = [];
    preventCallApi=true;
    currentStatus = {};
    countTextNotSeen = 0;
    currentConversation = null;

    constructor() {
        makeAutoObservable(this, {
            profileOfFriend: observable,
            currentConversation: observable,
            countTextNotSeen: observable,
            currentStatus: observable,
            preventCallApi: observable,
            conversations: observable,
            offlineStatus: observable,
            lastText: observable,
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
            action_setProfileOfFriend: action,
            action_setLastText: action,
            action_setLastTextByIndex: action,
            action_setOfflientStatus: action,
            action_setConversations: action,
            action_setPreventCallApi: action,
            action_updateStatusSeenConversation: action,
            action_updateStatusSeenSelf: action,
            action_setConverSationByIndex: action,
            action_updateConversationSeenOutRoomSeft: action,
            action_updateConversationSeenOutRoom: action,
            action_updateConnversationById: action,
            action_countTextNotSeen: action,
            action_setCurrentConversation: action,
        })
    }

    action_setCurrentConversation(convId) {
        this.currentConversation = convId;
    }

    action_countTextNotSeen(data) { 
        this.countTextNotSeen = countTextNotSeen(data);
    }
    ///update Status
    action_updateStatusSeenConversation(covId, string) {
        const result = findIndexFromArrayLodash(this.conversations, {_id: covId});
        if(result != -1) {
            try {
                if(string == "join") {
                    this.conversations[result].lastText.receiveSeen = true;
                    console.log("join room with ID: ",result);
                }
                else  {
                    this.conversations[result].lastText.receiveSeen = false;
                    console.log("out room with ID: ",result);}
                
            } catch(err) {
                console.log(err);
            }
        }
    }

    action_updateConversationSeenOutRoomSeft(covId) {
        const index = findIndexFromArrayLodash(this.conversations, {_id: covId});
        if(!this.conversations[index].lastText) this.conversations[index].lastText = {sendSeen: false}
        else this.conversations[index].lastText.sendSeen = false;
       
    }

    action_updateConversationSeenOutRoom(index) {
        if(!this.conversations[index].lastText) this.conversations[index].lastText = {receiveSeen: false}
        else this.conversations[index].lastText.receiveSeen = false;
    }
    action_updateStatusSeenSelf(covId) {
        const result = findIndexFromArrayLodash(this.conversations, {_id: covId});
        console.log("this is result: ",  this.conversations[result]);
        if(result != -1) {
            try {
                if(!this.conversations[result].lastText) this.conversations[result].lastText = {sendSeen: true}
                else this.conversations[result].lastText.sendSeen = true;
                if(this.conversations[result].lastText.seens != undefined) this.conversations[result].lastText.seens = true;
                
                
            } catch(err) {
                console.log(err);
            }
        }
        
        console.log(this.conversations[result]);
    }

    async action_setConverSationByIndex(data, index) {
        try {
            const receiveSeen = this.conversations[index].lastText.receiveSeen
            if(!receiveSeen) this.conversations[index].lastText.receiveSeen = false;
            this.conversations[index] = {...this.conversations[index],updatedAt: data.updatedAt};
            this.conversations[index].lastText = {...this.conversations[index].lastText,...data.lastText};
        } catch(err) {
            console.log(err);
        }
        await this.action_setConversations(sortConversationByUpdateAt(this.conversations))
    }
    async action_updateConnversationById(data,covId) {
        const index = findIndexFromArrayLodash(this.conversations, {_id: covId});
        if(index != -1) {
            try {
                const receiveSeen = this.conversations[index].lastText.receiveSeen
                if(!receiveSeen) this.conversations[index].lastText.receiveSeen = false;
                this.conversations[index].updatedAt = data.updatedAt;
                this.conversations[index].lastText = {...this.conversations[index].lastText,...data.lastText};
            } catch(err) {
                console.log(err);
            }
        }
        await this.action_setConversations(sortConversationByUpdateAt(this.conversations))

    }
    action_setPreventCallApi(data) {
        this.preventCallApi = data;
    }

    action_setConversations(data) {
        this.conversations = data;
    }
    action_setOfflientStatus() {
        this.offlineStatus = !this.offlineStatus;
    }
    action_setLastText(data) {
        this.lastText = data;
    }
    action_setLastTextByIndex(data, index) {
        this.lastText[index] = data;
    }

    action_setStatusPost() {
        this.statusPost = !this.statusPost;
    }
    action_setPosts(data) {
        this.posts = [...data,...this.posts];
    }

    async action_setProfileOfFriend(data) {
        if(data == "") this.profileOfFriend = {};
        else this.profileOfFriend = data;
    }

    async action_getProfile(userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getProfile}`;
        const result = await Request.get({userId}, DOMAIN);
        if(result) {
            if(!_.isEmpty(result.content)) {
                // this.profileOfFriend = result.content;
                return result.content;
            }
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
    // GET CONVERSATION
    async action_getConversation(userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getConversation}/${userId}`;

        const result = await Request.get({}, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) {
                this.conversations = sortConversationByUpdateAt(result.content);
                // this.action_countTextNotSeen(result.content);
                return result.content;
            }
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
    //Update Conversation 
    async action_updateConversation(data){
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.updateConversation}`;
        
        const result = await Request.post(data, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) return result.content;
            
        }
    }
}