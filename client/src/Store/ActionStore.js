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
    answerJoinRoom = [];
    listSendMess = [];
    listSendMessCopy = [];
    listCreateGroup = [];
    listAddMembers = [];
    listNotify = [];
    constructor() {
        makeAutoObservable(this, {
            listMess: observable,
            listAddMembers: observable,
            listNotify: observable,
            listCreateGroup: observable,
            listSendMessCopy: observable,
            listSendMess: observable,
            answerJoinRoom: observable,
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
            action_deleteUserGroup: action,
            action_updateLastMess: action,
            action_setAnswerJoinRoom: action,
            action_gotinnhan:action,
            action_setListSendMess: action,
            action_setCreateListGroup: action,
            action_saveNotify: action,
            action_getListNotify: action,
            action_setListNotify: action,
            action_updateSeenNotify: action,
            action_uploadImageInCov: action,
            action_callApiUploadImageCov: action,
            action_setListAddMember: action,
            action_addUserMemberCov: action,
        })
    }
    //them nguoi vao nhom
    async action_addUserMemberCov({covId, user}) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.addUserCov}`
        const urlBody = {
            covId,
            user
        } 
        const result = await Request.post(urlBody, DOMAIN);
        if(result) return true;
        else return false;
    }

    action_setListAddMember(data){
        this.listAddMembers = data;
    }
    async action_callApiUploadImageCov({covId, src,userId}) {

        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.updateImage}`
        const urlBody = {
            covId,
            userId,
            src
        } 
        const result = await Request.post(urlBody, DOMAIN);
        if(result) return true;
        else return false;
    }


     action_uploadImageInCov({covId, src,userId}) {
       
        // const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.updateImage}`
        // const urlBody = {
        //     covId,
        //     userId,
        //     src
        // } 
        // const result = await Request.post(urlBody, DOMAIN);
        // if(result) {
            const index = findIndexFromArrayLodash(this.conversations, {_id: covId});
            
            // this.conversations[index] = this.conversations.map(items => {
            //     items.members = items.members.map(member => {
            //          if(member?.id == userId) member.profilePicture = src;
            //          return member;
            //      })
            //      items.lastText.seens = items?.lastText?.seens.map(seen => {
            //          if(seen?.id == userId) seen.profilePicture = src;
            //          return seen;
            //      })
            //      return items;
            //  });
            const members = this.conversations[index].members.map(member => {
                if(member?.id == userId) member.profilePicture = src;
                return member;
            })
            const seens = this.conversations[index].lastText.seens.map(seen => {
                         if(seen?.id == userId) seen.profilePicture = src;
                         return seen;
                        })
            this.conversations[index] = {...this.conversations[index], members, lastText: {...this.conversations[index].lastText, seens}}
            // return true;
        // }
        // return false; 
        
        


        
    }   
    //cap nhat trang thai thong bao
    async action_updateSeenNotify(notifyId) {
        
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.updateSeenNotify}`
        const urlBody = {
            notifyId,
        } 
        const result = await Request.post(urlBody, DOMAIN);
        if(result) {
            return true;
        }
        return false; 
    }
    //set list thong bao
    action_setListNotify(data) {
        this.listNotify = data;
    }
    //lay danh sach thong bao
    async action_getListNotify(userId){
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.getListNotify}`
        const urlBody = {
            userId,
        } 
        const result = await Request.post(urlBody, DOMAIN);
        if(result) {
            this.action_setListNotify(result.content)
            return true;
        }
        return false; 
    }
    //luu thong bao 
    async action_saveNotify({userId, profilePicture, des}) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.saveNotify}`
        const urlBody = {
            userId,
            profilePicture,
            des,
        } 
        const result = await Request.post(urlBody, DOMAIN);
        if(result) {
            return result.content;
        }
        return false;
    }
    action_setCreateListGroup(data) {
        this.listCreateGroup = data;
    }
    //set list send mess
    action_setListSendMess(data) {
        this.listSendMess = [...data];
    
    }
    //set tra loi join room 
    action_setAnswerJoinRoom() {
        this.answerJoinRoom = ! this.answerJoinRoom;
    }
    //update last Mess
    async action_updateLastMess({messId, userId}) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.updateLastMess}`
        const urlBody = {
            messId,
            userId
        } 
        const result = await Request.post(urlBody, DOMAIN);
        if(result) return true;
        return false;

    }
    //action_deleteUserGroup

    async action_deleteUserGroup(covId, userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.leaveGroup}`
        const urlBody = {
            covId,
            userId
        } 
        const result = await Request.post(urlBody, DOMAIN);
        if(result) {
            const indexCov = findIndexFromArrayLodash(this.conversations, {_id: covId});
            _.remove(this.conversations[indexCov].members, function (value)  {
                return value.id  == userId;
            })
            return true;
        }
         
        else return false;
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
                if(result) return true;
                return false;
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
                if(result) return true;
                return false;
            }

            case 'leave': {
                const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.leaveGroup}`
                const urlBody = {
                    covId,
                    userId: data,
                } 
                const result = await Request.post(urlBody, DOMAIN);
                if(result) {
                    _.remove(this.conversations, function (value)  {
                        return value._id  == covId;
                    })
                    return true;
                }
               else return false;
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

        const result = await Request.post({userId}, DOMAIN);

        if(result) {
            if(!_.isEmpty(result.content)) {
                this.action_setCreateListGroup(result.content)
                this.action_setListAddMember(result.content)
                return result.content;
            }
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
                    console.log("action_searchFriend", res);
                    this.listSearch = res;
                    return res;
                }
                else  this.listSearch = [];
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

    //go tin nhan
    async action_gotinnhan(messId) {

        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.gotinnhan}`;
        const urlBody = {
            messId
        }
        const result = await Request.post(urlBody, DOMAIN);

        if(result) {
            return true;
        } 
    }
}