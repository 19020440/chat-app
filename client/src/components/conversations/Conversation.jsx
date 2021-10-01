import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import "./conversation.css";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash'
import {sortConversationByUpdateAt} from '../../helper/function'
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
  // useEffect(() => {
  //   if(!_.isEmpty(user)) {
  //     user?.status ? ref.current.classList.add("conversationTrue") : ref.current.classList.remove("conversationTrue");

  //   }
  // },[user]);
  const handlePassPage = (conversation) => {
      console.log("click click");
    history.push(`/messenger/${conversation._id}`)
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
                                        <li className="container-left__item" onClick={() => handlePassPage(conversation)}>
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
  

