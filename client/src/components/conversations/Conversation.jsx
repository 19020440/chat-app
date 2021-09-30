import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import "./conversation.css";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash'
import {sortConversationByUpdateAt} from '../../helper/function'

const Conversation = observer(({ conversation, currentUser,index,seen }) => {
  const ActionStore = useStore('ActionStore');
  const AuthStore = useStore('AuthStore');
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {offlineStatus} = ActionStore;
  const ref = useRef(null);
const count = useRef(0);
const conversations = sortConversationByUpdateAt(ActionStore.conversations);
  useEffect(() => {
    

    const getUser = async () => {
      try {
        const friendId = conversation.members.find((m) => m !== currentUser._id);
        const res = await ActionStore.action_getProfile(friendId);
        setUser(res);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation,ActionStore.offlineStatus]);

  useEffect(() => {
    if(!_.isEmpty(user)) {
      user?.status ? ref.current.classList.add("conversationTrue") : ref.current.classList.remove("conversationTrue");

    }
  },[user]);

  
  return (
    // <>
    
    // <div className="conversation" ref={ref}>
    //   <img
    //     className="conversationImg"
    //     src={
    //       user?.profilePicture
    //         ? user.profilePicture
    //         : PF + "person/noAvatar.png"
    //     }
    //     alt=""
    //   />
    //   <div className="conversation-text">
    //     <span className="conversationName">{user?.username}</span>
    //     {/* <span className="conversationName1">{ActionStore.lastText[index]?.lastText?.sender === currentUser._id &&  !_.isEmpty(conversation?.lastText) 
    //     ? `You: ${ActionStore.lastText[index].lastText?.text}` 
    //     : !_.isEmpty(ActionStore.lastText[index]?.lastText?.text) 
    //     ? `${ActionStore.lastText[index]?.lastText?.text}`: ""}</span> */}
    //     <div>
    //       <span className={`conversationName1${conversations[index]?.lastText?.sender === currentUser._id ?
    //         " color-text_while" 
    //         : seen? " color-text_while":" color-text_blue"}`}>
            
            
    //         {conversations[index]?.lastText?.sender === currentUser._id &&  !_.isEmpty(conversation?.lastText) 
    //       ? `You: ${conversations[index].lastText?.text}` 
    //       : !_.isEmpty(conversations[index]?.lastText?.text) 
    //       ? `${conversations[index]?.lastText?.text}`: ""}.
          
          
    //       </span>
    //       <span className="conversationName2"> {format(conversation.updatedAt)}</span>
    //     </div>
       
        
    //   </div>
      
    // </div>
    // </>
    <div className="container-left">
                    <div className="container-left__head">
                        <div className="container-left__head-top">
                            <div className="container-left__head-top-title">
                                Chat
                            </div>
                            <div className="container-left__head-top-group">
                                <div className="container-left__head-group-btn">
                                    {/* <i className="far fa-ellipsis-h"></i> */}
                                </div>
                                <div className="container-left__head-group-btn">
                                    {/* <i className="fas fa-video-plus"></i> */}
                                </div>
                                <div className="container-left__head-group-btn">
                                    {/* <i className="fas fa-edit"></i> */}
                                </div>
                            </div>
                        </div>
                        <div className="container-left__head-search">
                            <div className="container-left__search-box">
                                <div className="container-left__search-box-icon">
                                    {/* <i className="fal fa-search"></i> */}
                                </div>
                                <input type="text" className="container-left__search-box-input" placeholder="Tìm kiếm trên Messenger"/>
                            </div>
                        </div>
                    </div>
                    <div className="container-left__body">
                        <ul className="container-left__list">
                            <li className="container-left__item">
                                <div className="container-left__item-avatar">
                                    <img src="" alt="" className="container-left__item-avatar-img"/>
                                </div>
                                <div className="container-left__item-info">
                                    <div className="container-left__item-info-name">
                                        Minh Trần
                                    </div>
                                    <div className="container-left__item-info-sub">
                                        <div className="container-left__item-info-last-mess">
                                            Okii mai
                                        </div>
                                        ·
                                        <div className="container-left__item-info-time">
                                            <span>
                                                1
                                            </span>
                                            giờ
                                        </div>
                                    </div>
                                </div>
                                <div className="container-left__item-see">
                                    <div className="container-left__item-see-img">
                                        <img src="" alt=""/>
                                    </div>
                                    <div className="container-left__item-see-icon">
                                        {/* <i className="fas fa-check-circle"></i> */}
                                    </div>
                                </div>
                            </li>
                            <li className="container-left__item active">
                                <div className="container-left__item-avatar">
                                    <img src="" alt="" className="container-left__item-avatar-img"/>
                                </div>
                                <div className="container-left__item-info">
                                    <div className="container-left__item-info-name">
                                        Minh Trần
                                    </div>
                                    <div className="container-left__item-info-sub">
                                        <div className="container-left__item-info-last-mess">
                                            Okii mai
                                        </div>
                                        ·
                                        <div className="container-left__item-info-time">
                                            <span>
                                                1
                                            </span>
                                            giờ
                                        </div>
                                    </div>
                                </div>
                                <div className="container-left__item-see">
                                    <div className="container-left__item-see-img">
                                        <img src="" alt="" />
                                    </div>
                                    <div className="container-left__item-see-icon">
                                        {/* <i className="fas fa-check-circle"></i> */}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
  );
});
export default Conversation;
  

