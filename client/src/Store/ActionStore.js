import _ from 'lodash';
import {observable, makeAutoObservable, action} from 'mobx'
import {WsCode} from '../helper/Wscode'
import {CONFIG_URL} from "../helper/constant"
import {Request} from "../helper/Request"
import {getLessProfile, countTextNotSeen,findIndexFromArrayLodash,sortConversationByUpdateAt,findObjectFromArrayLodash} from '../helper/function';
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
    listMess = [];

    constructor() {
        makeAutoObservable(this, {
            listMess: observable,
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
            action_resetListSearchFriend: action,
            action_changePropertyConversation: action,
            action_resetAllData:action,
        })
    }
    //Restet All DAta 
    action_resetAllData() {
        this.profileOfFriend = {};
        this.posts = [];
        this.statusPost = false;
        this.listSearch = [];
        this.lastText = [];
        this.offlineStatus = false;
        this.conversations = [];
        this.preventCallApi=true;
        this.currentStatus = {};
        this.countTextNotSeen = 0;
        this.currentConversation = null;
        this.listMess = [];
    }
    //chang-property-conversation
    async action_changePropertyConversation(type,covId,data) {
        switch(type) {
            case "members": {
                const covIndex = findIndexFromArrayLodash(this.conversations, {_id: covId});
                this.conversations[covIndex].members = [...data];
                const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.updateConversation}`
                const urlBody = {
                    data,
                    text: "members",
                    covId
                }
                const result = await Request.post(urlBody, DOMAIN);
                if(result) console.log("update members: ",result.content);
                break;
            }    

            case "name": {
                const covIndex = findIndexFromArrayLodash(this.conversations, {_id: covId});
                this.conversations[covIndex] = {...this.conversations[covIndex],name: data};
                const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.updateConversation}`
                const urlBody = {
                    data,
                    text: "name",
                    covId
                }
                const result = await Request.post(urlBody, DOMAIN);
                if(result) console.log("update name: ",result.content);
                break;
            }

            case 'leave': {
                _.remove(this.conversations, function (value)  {
                    return value._id  == covId;
                })
                break;
            }
            default: break;
        }
        
    }

    action_setCurrentConversation(convId) {
        this.currentConversation = convId;
    }

    action_countTextNotSeen(data) { 
        this.countTextNotSeen = countTextNotSeen(data);
    }
    ///update Status
    action_updateStatusSeenConversation({conversationId,senderId}, string) {
        const result = findIndexFromArrayLodash(this.conversations, {_id: conversationId});
        if(result != -1) {
            try {
                if(string == "join") {
                        this.conversations[result].lastText.seens =  this.conversations[result].lastText.seens.map((value) =>{
                        if(value.id == senderId) {
                            value.seen = true;
                            value.joinRoom = true;
                        }
                        return value;
                    });
                    console.log("join room with ID: ",result);
                }
                else  {
                    this.conversations[result].lastText.seens =  this.conversations[result].lastText.seens.map((value) =>{
                        if(value.id == senderId) {
                            value.seen = false;
                            value.joinRoom = false;
                        }
                        return value;
                    });
                    console.log("out room with ID: ",result);}
                
            } catch(err) {
                console.log(err);
            }
        }
    }

    action_updateStatusSeenMembers({conversationId,senderId}, string) {
        // console.log(senderId);
        const result = findIndexFromArrayLodash(this.conversations, {_id: conversationId});
        if(result != -1) {
            try {
                if(string == "join") {
                    this.conversations[result].members =  this.conversations[result].members.map((value) =>{
                        if(value.id == senderId) value.status = true;
                        return value;
                    });
                    // console.log("join online with ID: ",result);
                }
                else  {
                    this.conversations[result].members =  this.conversations[result].members.map((value) =>{
                        if(value.id == senderId) value.status = false;
                        return value;
                    });
                    // console.log("out offline with ID: ",result);
                }
                
            } catch(err) {
                console.log(err);
            }
        }
    }


    action_updateConversationSeenOutRoom(index) {
        if(!this.conversations[index].lastText) this.conversations[index].lastText = {receiveSeen: false}
        else this.conversations[index].lastText.receiveSeen = false;
    }
    action_updateStatusSeenSelf({conversationId, senderId}) {
       const cov = findObjectFromArrayLodash(this.conversations, {_id: conversationId});

       cov.lastText.seens.map(value => {
           if(value.id == senderId) {
               value.joinRoom = true;
               value.seen = true;
           } else {
               if(value.joinRoom) value.seen = true;
               else value.seen = false;
           }
       })

        
    }

    async action_setConverSationByIndex(data, index) {
        try {

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
                // const receiveSeen = this.conversations[index].lastText.receiveSeen
                // if(!receiveSeen) this.conversations[index].lastText.receiveSeen = false;
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
            if(!_.isEmpty(result.content)){
                this.listMess = result.content;
                return result.content;
            } 
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
    /// SEARCH FRIEND
    async action_searchFriend(data) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.searchFriend}`;
        const json = {
            "word": data,
        }
        if(data != "") {
            const result = await Request.post(json, DOMAIN);
            if(result) {
                if(!_.isEmpty(result.content)) {
                    const res = getLessProfile(result.content);
                    this.listSearch = res;
                    return res;
                }
                else return [];
            }
        } else this.listSearch = [];
    }

    async action_searchFriendInfo(data) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.searchFriend}`;
        const json = {
            "word": data,
        }
            const result = await Request.post(json, DOMAIN);
            if(result) {
                if(!_.isEmpty(result.content)) {
                    const res = getLessProfile(result.content);
                    return res;
                }
                else return [];
            }
    }

    action_resetListSearchFriend() {
        this.listSearch = [];
    }

    async action_getCovBySearch(userId, searchUserId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.searchCov}/${userId}/${searchUserId}`;

        const result = await Request.get({}, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) {
                this.action_setConversations([...this.conversations,result.content]);
                return result.content;
            }
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