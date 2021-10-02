import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import "./conversation.css";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash'
import {sortConversationByUpdateAt,findObjectFromArrayLodash} from '../../helper/function'
import ProfileRight from '../ProfileRight/ProfileRight'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faEllipsisH,faPenSquare,faVideo } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from "react-router-dom";
library.add( fab,faEllipsisH,faVideo,faPenSquare) 

const Conversation = observer(() => {
    const ActionStore = useStore('ActionStore');
    const AuthStore = useStore('AuthStore');      
    const conversations = sortConversationByUpdateAt(ActionStore.conversations);
    const history = useHistory();
    const beforeConversation = useRef(null);
    const currentConversation = useRef(null);

    useEffect(() => {
        currentConversation.current = ActionStore.currentConversation;
    },[ActionStore.currentConversation])
  const handlePassPage = async (conversation) => {
    history.push(`/messenger/${conversation._id}`);
    if(beforeConversation.current != currentConversation.current) {
        try {
            const conversations = findObjectFromArrayLodash(ActionStore.conversations, {_id: beforeConversation.current});
            const friendId = conversations.members.find((m) => m !== AuthStore.user?._id);
            const res = await ActionStore.action_getProfile(friendId);
            ActionStore.action_updateConversationSeenOutRoomSeft(beforeConversation.current);
            AuthStore.socket?.emit("out_room",  {socketId: res?.socketId, conversationId: conversations._id});
  
          } catch(err) {
            console.log(err);
          }
    }
  }

  
  return (
    <div className="container-left">
                    <div className="container-left__head">
                        <div className="container-left__head-top">
                            <div className="container-left__head-top-title">
                                Chat
                            </div>
                            <div className="container-left__head-top-group">
                                <div className="container-left__head-group-btn">
                                    <FontAwesomeIcon icon="fa-solid fa-ellipsis-h" />
                                </div>
                                <div className="container-left__head-group-btn">
                                    <FontAwesomeIcon icon="fa-solid fa-video" />
                                </div>
                                <div className="container-left__head-group-btn">
                                    <FontAwesomeIcon icon={faPenSquare} />
                                </div>
                            </div>
                        </div>
                        <div className="container-left__head-search">
                            <div className="container-left__search-box">
                                <div className="container-left__search-box-icon">
                                    <i className="fal fa-search"></i>
                                </div>
                                <input type="text" className="container-left__search-box-input" placeholder="Tìm kiếm trên Messenger"/>
                            </div>
                        </div>
                    </div>
                    <div className="container-left__body">
                        <ul className="container-left__list">
                            
                                {conversations.map((conversation,index) => {
                                    return (
                                        < >
                                        <li className="container-left__item" onClick={async () => {
                                            currentConversation.current = conversation?._id
                                            await handlePassPage(conversation);
                                            beforeConversation.current = conversation?._id;
                                            
                                        }}>
                                            <ProfileRight conversation={conversation} seen={conversation.lastText?.seens?true:false}/>
                                        </li>
                                        </>
                                    )
                                })}
                                
                            
                            
                        </ul>
                    </div>
                </div>
  );
});
export default Conversation;
  

