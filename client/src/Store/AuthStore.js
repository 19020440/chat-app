import {observable, makeAutoObservable, action} from 'mobx'
import {Request} from '../helper/Request'
import {CONFIG_URL} from '../helper/constant'
import {WsCode} from '../helper/Wscode'
import { deleteItemInArrayByIndex } from '../helper/function'
import _ from 'lodash'
import axios from 'axios'
export  class AuthStore {

    login = 2;
    user = {};
    socket;
    statusSeenText = false;
    themePage = true;
    activeContainer = false;
    CallVideoSocketId = "";
    statusSearchMess = false;
    stt = null;
    textSearch = null;
    textFile = [];
    GifphyList = [];
    textGif = null;
    textFileName = [];
    cancelImageIndex = null;
    listRoom = [];
    listStatusCov = [];
    listFollow = [];
    status_addUser = false;
    constructor() {
        makeAutoObservable(this,{
            listFollow: observable,
            status_addUser: observable,
            listStatusCov: observable,
            listRoom: observable,
            stt:observable,
            textGif: observable,
            themePage: observable,
            statusSearchMess: observable,
            CallVideoSocketId: observable,
            activeContainer: observable,
            login: observable,
            socket: observable,
            user: observable,
            action_login:action,
            action_setLogin: action,
            action_logout: action,
            action_setSocket: action,
            action_setSatusSeenText: action,
            action_setTheme: action,
            action_setCallVideoSocketId: action,
            action_searchMess: action,
            action_setTextSearch:action,
            action_uploadFile: action,
            action_setTextFile: action,
            action_getGifPhyList:action,
            action_setTextGif: action,
            action_resetTextFile: action,
            cancelImageIndex: observable,
            action_setCancelImageIndex: action,
            action_setListRoom: action,
            action_addFriend: action,
            action_resetAllData:action,
            action_register: action,
            action_uploadFileHeader: action,
            action_update_profile: action,
            action_get_list_invite: action,
            action_addUser: action,
        })
    }
    //action add suer
    action_addUser() {
        this.status_addUser = !this.status_addUser
    }
    //REGISTER
    async action_register(data) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.register}`
        
        const result = await Request.post(data,DOMAIN);

        if(result) {
            return true;
        } else return false;
    }
    //ResetAllData
    action_resetAllData() {
        this.login = 2;
        this.user = {};
        this.socket = null;
        this.statusSeenText = false;
        this.themePage = true;
        this.activeContainer = false;
        this.CallVideoSocketId = "";
        this.statusSearchMess = false;
        this.stt = null;
        this.textSearch = null;
        this.textFile = [];
        this.GifphyList = [];
        this.textGif = null;
        this.textFileName = [];
        this.cancelImageIndex = null;
        this.listRoom = [];
        this.listStatusCov = [];
    }
    //ADd Friend and Cancel Friends
    async action_addFriend(status,userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.follow}/${userId}/${status?"follow": "unfollow"}`;
        const json = {
            userId: this.user._id,
        }
        const result = await Request.post(json, DOMAIN);
        if(result) return true;
        else return false;
    }
    action_setListStatusCov(data) {
        this.listStatusCov = [...this.listStatusCov, data]; 
    }
    action_setListRoom(data) {
        this.listRoom = data;
    }
    async action_setCancelImageIndex(index) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.deleteImage}`;
        const json = {
            path: this.textFileName[index],
        }

        const result = await Request.post(json, DOMAIN);

        if(result) {
            console.log(result.content);
            this.textFileName = deleteItemInArrayByIndex(this.textFileName, index);
            this.textFile = deleteItemInArrayByIndex(this.textFile, index);
            // this.cancelImageIndex = index;
        }

        

    }
    action_resetTextFile() {
        this.textFile = [];
    }
    action_setTextGif(data) {
        this.textGif = data;
    }
    async action_getGifPhyList(data) {
        if(data != "") {
            try {
                const result = await axios("https://api.giphy.com/v1/gifs/search", {
                    params: {
                        api_key: "DM9k1GJss6SpFFpsZM8gQeCYLA7FnuIw",
                        q: data,
                    }
                });
                console.log(result.data.data);
                this.GifphyList = result.data.data;
            } catch(er) {
               console.log(er); 
            }
        } else {

            try {
                const result = await axios("https://api.giphy.com/v1/gifs/trending", {
                    params: {
                        api_key: "DM9k1GJss6SpFFpsZM8gQeCYLA7FnuIw"
                    }
                });
        
               this.GifphyList = result.data.data;
            } catch(err) {
                console.log(err);
            }

        }
       
       
    }
    action_setTextFile(data) {
        this.textFile = [...this.textFile,data];
    }
    async action_uploadFile(file) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.upload}`
       const result =  await file.map(async (value) => {

            const formData = new FormData();
            const fileName = Date.now() +"_"+ value.name;
            formData.append("name", fileName);
            formData.append("file", value);
            
            
    
            const result = await Request.post(formData,DOMAIN);
            if(result) {
                const url =  `${CONFIG_URL.SERVICE_TEXT_FILE}/${result.content}`
                await this.action_setTextFile(url);
                this.textFileName = [...this.textFileName, result.content]
            }
        })
        return result;
       
    }

    async action_uploadFileHeader({file, userId}) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.upload}`

 
             const formData = new FormData();
             const fileName = Date.now() +"_"+ file.name;
             formData.append("name", fileName);
             formData.append("file", file);
             formData.append("userId", userId);

             const result = await Request.post(formData,DOMAIN);
             if(result) {
                 const url =  `${CONFIG_URL.SERVICE_TEXT_FILE}/${result.content}`;
                 return url;
             }


       
       
    }
    action_setTextSearch(data) {
        this.textSearch = data;
    }
    action_setStt(data) {
        this.stt = data;
    }
    action_searchMess(data) {
        this.statusSearchMess = data;
    }
    action_setCallVideoSocketId(data) {
        this.CallVideoSocketId = data;
    }
    action_setActiveContainer() {
        this.activeContainer = !this.activeContainer;
    }
    action_setTheme() {
        this.themePage = !this.themePage;
    }
    action_setSatusSeenText() {
        this.statusSeenText = !this.statusSeenText;
    }

    async action_setLogin(value) {
        this.login = value;
    }
    action_setSocket(data) {
        this.socket = data;
    } 

    async action_login(data) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.login}`
        const result = await Request.post(data, DOMAIN);

        if(result) {
            this.user = result.content;
            this.listFollow = result.content.followings;
            this.login  = 1;
            // !_.isEmpty(this.socket) && this.socket?.emit("online",{email: data.email, id :this.socket.id});
            await sessionStorage.setItem("token", result.token);
            return true;
        }

    }

    async action_valdLogin() {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.valid}`
        const result = await Request.get({}, DOMAIN);
        if(result) {
            if(! _.isEmpty(result.content)) {
                this.user = result.content;
                this.listFollow = result.content.followings;
                
                this.socket?.emit('validLogin');
                this.socket?.on('setvalidLogin', (socketId) => {
                    this.user.socketId = socketId;
                    this.login = 1;
                })
                
            }
        }

    }

    async action_logout() {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.logout}`

        const result = await Request.post({email: this.user?.email}, DOMAIN);

        if(result) {
            this.login = 0;
            await sessionStorage.removeItem("token");
            this.action_resetAllData();
            
        }

        
    }
    // update profile
    async action_update_profile(urlBody) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.update_profile}`;
        const body = {
            userId: this.user._id,
            data: urlBody
        }
        const result = await Request.post(body, DOMAIN);

        if(result) return true;
        return false;
    }
    // Get list user invite
    async action_get_list_invite(userId) {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.listInvite}`;
        const body = {
            userId
        }
        const result = await Request.post(body, DOMAIN);
        if(result) return result.content;
    }
}