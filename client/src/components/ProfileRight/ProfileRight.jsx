import React, {useEffect, useRef, useState, memo} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../hook'
import _ from 'lodash'
import { format } from "timeago.js";
const ProfileRight = observer(({conversation, seen,isGroup}) =>{
    const [user, setUser] = useState({});
    const ActionStore = useStore('ActionStore');
    const AuthStore = useStore('AuthStore');
    const PF = process.env.REACT_APP_PUBLIC_FOLDER; 
    const lasttextLen =  conversation.lastText?.text ? _.isArray(JSON.parse(conversation.lastText?.text)) ? _.size(JSON.parse(conversation.lastText?.text)) : 0 : 0;
   
    const seenStatus = seen[0].seen;
    useEffect(() => {   
        if(isGroup) {
            const status = _.size(conversation.members.filter(value => value.id != AuthStore.user._id && value.status)) >=1 ? true : false;
            setUser({
                username: conversation.name,
                profilePicture: conversation.covImage,
                status: status
            })
        } else {
            const [userProfile] = conversation.members.filter(value => value.id != AuthStore?.user._id);
            setUser(userProfile);  
        }
           
    }, [ActionStore.offlineStatus,conversation]);

    
    
    return (
        <div className="status">
                                <div className="container-left__item-avatar">
                                    <img src={
                                    user?.profilePicture
                                        ? user.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" className="container-left__item-avatar-img"/>
                                    
                                </div>
                                <span className={user?.status ? "status_active" : " "}></span>
                                <div className="container-left__item-info">
                                    
                                    <div className="container-left__item-info-name">
                                        {user?.username}
                                    </div>
                                    <div className="container-left__item-info-sub">
                                        <div className="container-left__item-info-last-mess">
                                            {!_.isEmpty(conversation?.lastText) &&
                                                <span className={`conversationName1${conversation?.lastText?.sender === AuthStore.user?._id ?
                                                    " color-text_while" 
                                                    : seenStatus? " color-text_while":" color-text_blue"}`}>
                                                    
                                                    
                                                    {conversation?.lastText?.sender === AuthStore.user?._id &&  !_.isEmpty(conversation?.lastText) 
                                                ? _.isArray(JSON.parse(conversation.lastText?.text)) ? `You: Bạn vừa gửi  ${lasttextLen} ảnh` :`You: ${JSON.parse(conversation.lastText?.text)}` 
                                                : !_.isEmpty(conversation?.lastText?.text) 
                                                ?  _.isArray(JSON.parse(conversation.lastText?.text))?`Bạn nhận được ${lasttextLen} ảnh` 
                                                : `${JSON.parse(conversation?.lastText?.text)}`
                                                : ""}

                                            </span>
                                            
                                            }
                                            
                                        </div>
                                        ·
                                        <div className="container-left__item-info-time">
                                            <span>
                                            {format(conversation.updatedAt)}
                                            </span>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="container-left__item-see">
                                    <div className="container-left__item-see-img">
                                        <img src="" alt=""/>
                                    </div>
                                    <div className="container-left__item-see-icon">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                </div>
            </div>
    );
});
   

export default (ProfileRight);