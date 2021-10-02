import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../hook'
import _ from 'lodash'
import { format } from "timeago.js";
const ProfileRight = observer(({conversation, seen}) =>{
    const [user, setUser] = useState({});
    const ActionStore = useStore('ActionStore');
    const AuthStore = useStore('AuthStore');
    const PF = process.env.REACT_APP_PUBLIC_FOLDER; 
    useEffect(() => {
    const getUser = async () => {
        try {
          const friendId = conversation.members.find((m) => m !== AuthStore.user?._id);
          const res = await ActionStore.action_getProfile(friendId);
          setUser(res);
        } catch (err) {
          console.log(err);
        }
      };
      getUser();
    }, [ conversation,ActionStore.offlineStatus]);
    return (
        <>
        <div className="container-left__item-avatar">
                                    <img src={
                                    user?.profilePicture
                                        ? user.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" className="container-left__item-avatar-img"/>
                                </div>
                                
                                <div className="container-left__item-info">
                                    <span className={user?.status ? "status_active" : " "}></span>
                                    <div className="container-left__item-info-name">
                                        {user?.username}
                                    </div>
                                    <div className="container-left__item-info-sub">
                                        <div className="container-left__item-info-last-mess">
                                            <span className={`conversationName1${conversation?.lastText?.sender === AuthStore.user?._id ?
                                                    " color-text_while" 
                                                    : seen? " color-text_while":" color-text_blue"}`}>
                                                    
                                                    
                                                    {conversation?.lastText?.sender === AuthStore.user?._id &&  !_.isEmpty(conversation?.lastText) 
                                                ? `You: ${conversation.lastText?.text}` 
                                                : !_.isEmpty(conversation?.lastText?.text) 
                                                ? `${conversation?.lastText?.text}`: ""}.
                
            
                                            </span>
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
                                </>
    );
});
   

export default ProfileRight;