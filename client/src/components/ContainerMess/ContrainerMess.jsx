import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faAirFreshener, faGift, faInfoCircle, faPhone, faPlusCircle, faPortrait,faArrowAltCircleRight,faThumbsUp, faSearch, faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons'
import Message from "../../components/message/Message";
import {findIndexLastTextSeen,addSpantoText,findIndexFromArrayLodash} from '../../helper/function'
import { useEffect, useRef, useState } from "react";
import { Switch, Route,Link, useParams} from "react-router-dom";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash';
import ContainerRight from '../containerRight/ContainerRight'
import SearchMess from '../searchMess/searchMess'
import './containermess.css'

library.add(fab,faPhone,faInfoCircle,faPlusCircle,faPortrait,faAirFreshener,faGift,faArrowAltCircleRight,faThumbsUp,faSearch,faChevronDown,faChevronUp) 

const ContrainerMess = observer((props) => {
    const AuthStore = useStore('AuthStore')
    const ActionStore = useStore('ActionStore');
    const [messages, setMessages] = useState([]);
    const {conversationId} = useParams();
    const covId = conversationId;
    const {user} = AuthStore;
    const indexConversation = findIndexFromArrayLodash(ActionStore.conversations, {_id: conversationId});
    const currentConversation = ActionStore.conversations[indexConversation];
    const [newMessage, setNewMessage] = useState("");
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [arrivalMessage,setArrivalMessage]= useState(null)
    const scrollRef = useRef(null);

    useEffect(() => {
      if(findIndexFromArrayLodash != -1) {
        ActionStore.action_setCurrentConversation(covId);
      }
    },[])

    /// get message
    useEffect(() => {
          getMessages(); 
      }, [conversationId,AuthStore.statusSeenText]);
      const getMessages = async () => {
        try {
          const res = await ActionStore.action_getAllMessageOfConversation(conversationId)
          setMessages(res);
        } catch (err) {
          console.log(err);
        }
      };

      //send message
      const handleSubmit = async (e) => {
        e.preventDefault();
        const statusSeen = ActionStore.conversations[indexConversation]?.lastText?.receiveSeen ? true:false;
        console.log(covId);
        try {
          const message = {
            sender: user._id,
            text: newMessage,
            conversationId: covId,
            seens: statusSeen,
          };
          const {conversationId,...lastText} = message;
        if(indexConversation !== null){
          // ActionStore.action_setLastTextByIndex({_id: conversationId, lastText}, currentLastText.current); 
          ActionStore.action_setConverSationByIndex({updatedAt: Date(Date.now()),lastText}, indexConversation);
        }
        
        
    
        const receiverId = currentConversation.members.find(
          (member) => member !== user._id
        );
        // AuthStore.socket?.emit("update_conversation", )
    
       AuthStore.socket?.emit("sendMessage", {
          senderId: user._id,
          receiverId,
          text: newMessage,
          updatedAt: Date.now(),
          conversationId: currentConversation?._id,
          seens: statusSeen,
        });
    
        try {
          // const res = await axios.post("/messages", message);
          // console.log(ActionStore.conversations[currentLastText.current]?.lastText?.receiveSeen);
          const res = await ActionStore.action_saveMessage(message);
          
          setMessages([...messages, res]);
          setNewMessage("");
        } catch (err) {
          console.log(err);
        }
        } catch(err) {
          console.log(err);
        }


      };

      const handleCallVideo =  () => {
        window.open(`http://localhost:3000/callvideo?from=${user._id}&room=${covId}&status=${0}`)
  }

      const handleShowRightConversation = () => {
        AuthStore.action_setActiveContainer();
        }
      // set arrives message
      useEffect(() => {
        arrivalMessage &&
        currentConversation?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage, currentConversation]);

      useEffect(() => {
        AuthStore.socket?.on("getMessage", (data) => {
            console.log("this is text: ", data.text);
        //    ActionStore.action_updateConnversationById({
        //      updatedAt:Date(data.updatedAt),
        //      lastText: {
        //        sender: data.senderId,
        //        text: data.text,
        //        seens: data.seens,
        //      }
        //    }, data.conversationId);
           setArrivalMessage({
             sender: data.senderId,
             text: data.text,
             createdAt: Date.now(),
           });
          // setMessages((prev) => [...prev, {
          //   sender: data.senderId,
          //   text: data.text,
          //   createdAt: Date.now(),
          // }]);
         });
       }, []);
      


       //sear mess
       useEffect(() => {
        if(AuthStore.stt !==null) {
          let spanText = document.querySelector('.hight_light-text');
          if(spanText) spanText.classList.remove("hight_light-text");
          let result =  document.getElementById(`mess${AuthStore.stt}`);
          const text =  result.querySelector('.messageText').innerHTML;
          result.querySelector('.messageText').innerHTML = addSpantoText(text,AuthStore.textSearch)
          document.getElementById(`mess${AuthStore.stt != 0 ? AuthStore.stt-1 : 0}`).scrollIntoView();  
        } else {
          let spanText = document.querySelector('.hight_light-text');
          if(spanText) spanText.classList.remove("hight_light-text");
        }
       },[AuthStore.stt])

    //Join Room 
    useEffect(() => {
      if(!_.isEmpty(currentConversation)) {
      handleJoinRoom(currentConversation);
      }
    },[ActionStore.profileOfFriend])
  const handleJoinRoom = async (conversation) => {
    try {
    //  const friendId = conversation.members.find((m) => m !== user._id);
     const res = ActionStore.profileOfFriend;
     AuthStore.socket?.emit("join_room", {socketId: res?.socketId, conversationId: conversation._id, receiveId: res?._id})
     ActionStore.action_updateStatusSeenSelf(conversation._id); 
     
   } catch (err) {
     console.log(err);
   }
     
}

//get Profile
useEffect(() => {
  profileFriend();
},[ActionStore.offlineStatus, covId])

const profileFriend = async () => {
  // ActionStore.action_setProfileOfFriend("");
  if(!_.isEmpty(currentConversation)) {
    const friendId = currentConversation.members.find((m) => m !== user._id); 
    try {
      const res = await ActionStore.action_getProfile(friendId);
      ActionStore.action_setProfileOfFriend(res);
    } catch (err) {
      console.log(err);
    }
  }
  
}

useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
    return (
        <>
            <div className="container-main">
                    <div className="container-main__head">
                        <div className="container-main__head-left">
                            <div className="container-main__head-left-avt">
                                <img className="container-main__head-left-avt-img avt-mess" src={
                                    ActionStore.profileOfFriend?.profilePicture
                                        ? ActionStore.profileOfFriend?.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" />
                            </div>
                            <span className={ActionStore.profileOfFriend?.status ? "status_active1":""}></span>
                            <div className="container-main__head-left-info">
                                <div className="container-main__head-left-info__name name-mess">
                                    {ActionStore.profileOfFriend?.username}
                                </div>
                                <div className="container-main__head-left-info-time online">
                                    Hoạt động
                                    <span>1</span>
                                    giờ trước
                                </div>
                            </div>
                        </div>
                        <div className="container-main__head-right">
                            <div className="container-main__head-right-btn">
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                            <div className="container-main__head-right-btn" onClick={handleCallVideo}>
                                <FontAwesomeIcon icon="fa-solid fa-video" />
                            </div>
                            <div className="container-main__head-right-btn more-info-btn" onClick={handleShowRightConversation}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </div>
                        </div>
                        {AuthStore.statusSearchMess &&  <SearchMess/>}
                       
                    </div>
                    <div className="container-main__body">
                        <div className="container-main__list--no-content">
                            <div className="no-content__avt">
                                <img src={
                                    ActionStore.profileOfFriend?.profilePicture
                                        ? ActionStore.profileOfFriend?.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" className="no-content__img avt-mess" />
                            </div>
                            <div className="no-content__info">
                                <div className="no-content__info-name name-mess">
                                {ActionStore.profileOfFriend?.username} 
                                </div>
                                <div className="no-content__info-sub">
                                    Facebook

                                    Các bạn là bạn bè trên Facebook
                                </div>
                            </div>
                        </div>
                            <ul className="container-main__list">
                                {/* <div > */}
                                    {messages.map((m, index) => {
                                        return (
                                            <li className="container-main__item1" ref={scrollRef} id={`mess${index}`}>
                                                <Message message={m} own={m.sender === user._id} 
                                                    // seen={(index == (_.size(messages)-1)) && m.seens ? true:false}
                                                    seen={m.seens}
                                                    lastTextSeen = {findIndexLastTextSeen(messages) == index ? true:false}
                                                />
                                            </li>
                                        );
                                    })}
                                {/* </div> */}
                                 
                            </ul>
                    </div>
                    <div className="container-main__bottom">
                        <div className="container-main__bottom-left">
                            <div className="container-main__bottom-left-icon">
                                {/* <i className="fas fa-plus-circle"></i> */}
                                <FontAwesomeIcon icon={faPlusCircle} />
                            </div>
                            <div className="container-main__bottom-left-icon hide">
                                <FontAwesomeIcon icon={faPortrait} />
                            </div>
                            <div className="container-main__bottom-left-icon hide">
                            
                                <FontAwesomeIcon icon={faAirFreshener} />
                            </div>
                            <div className="container-main__bottom-left-icon hide">
                            
                            <FontAwesomeIcon icon={faGift} />
                            </div>
                        </div>
                        <div className="container-main__bottom-search">
                            <input type="text" placeholder="Aa" className="container-main__bottom-search-input"  
                            onChange={(e) => setNewMessage(e.target.value)}
                            value={newMessage}
                            />
                            <div className="container-main__bottom-search__icon">
                                <i className="fas fa-smile-wink"></i>
                                <div className="container-main__bottom-search__list-icon">
                                    <div className="container-main__bottom-icon-item">
                                        <i  alt="&#xf4da;" className="fas fa-smile-wink"></i>
                                    </div>
                                    <div className="container-main__bottom-icon-item">
                                        <i alt="&#xf5b4;" className="fas fa-sad-tear"></i>
                                    </div>
                                    <div className="container-main__bottom-icon-item">
                                        <i alt="&#xf586;" className="fas fa-grin-squint-tears"></i>
                                    </div>
                                    <div className="container-main__bottom-icon-item">
                                        <i alt="&#xf556;" className="fas fa-angry"></i>
                                    </div>
                                    <div className="container-main__bottom-icon-item">
                                        <i alt="&#xf579;" className="fas fa-flushed"></i>
                                    </div>
                                    <div className="container-main__bottom-icon-item">
                                        <i alt="&#xf5a4;" className="fas fa-meh-blank"></i>
                                    </div>
                                    <div className="container-main__bottom-icon-item">
                                        <i alt="&#xf5a5;" className="fas fa-meh-rolling-eyes"></i>
                                    </div>
                                    <div className="container-main__bottom-icon-item">
                                        <i alt="&#xf11a;" className="fas fa-meh"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-main__bottom-right">
                            <div className="container-main__bottom-thumb-up">
                                <FontAwesomeIcon icon={faThumbsUp} />
                            </div>
                            <div className="container-main__bottom-send"  onClick={handleSubmit}>
                                <FontAwesomeIcon icon={faArrowAltCircleRight} />
                            </div>
                        </div>
                    </div>
                </div>
        
                                <ContainerRight />
        </>
    );
})

export default ContrainerMess;