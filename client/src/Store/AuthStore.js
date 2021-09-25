import {observable, makeAutoObservable, action} from 'mobx'
import {Request} from '../helper/Request'
import {CONFIG_URL} from '../helper/constant'
import {WsCode} from '../helper/Wscode'
import _ from 'lodash'
export  class AuthStore {

    login = 2;
    user = {};
    socket;
    constructor() {
        makeAutoObservable(this,{
            login: observable,
            socket: observable,
            user: observable,
            action_login:action,
            action_setLogin: action,
            action_logout: action,
            action_setSocket: action,

        })
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