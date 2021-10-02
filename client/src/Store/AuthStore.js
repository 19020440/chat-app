import {observable, makeAutoObservable, action} from 'mobx'
import {Request} from '../helper/Request'
import {CONFIG_URL} from '../helper/constant'
import {WsCode} from '../helper/Wscode'
import _ from 'lodash'
export  class AuthStore {

    login = 2;
    user = {};
    socket;
    statusSeenText = false;
    themePage = true;
    activeContainer = false;
    constructor() {
        makeAutoObservable(this,{
            themePage: observable,
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
        })
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
            this.login  = 1;
            !_.isEmpty(this.socket) && this.socket?.emit("online",{email: data.email, id :this.socket.id});
            await sessionStorage.setItem("token", result.token);
        }

    }

    async action_valdLogin() {
        const DOMAIN = `${CONFIG_URL.SERVICE_URL}/${WsCode.valid}`
        const result = await Request.get({}, DOMAIN);
        if(result) {
            if(! _.isEmpty(result.content)) {
                this.login = 1;
                this.user = result.content;
                this.socket?.emit('validLogin');
                this.socket?.on('setvalidLogin', (socketId) => {
                  this.socket?.emit("online",{email: this.user?.email, id : socketId});
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
            
        }

        
    }

}