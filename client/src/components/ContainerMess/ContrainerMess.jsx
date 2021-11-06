import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faAirFreshener, faGift, faInfoCircle, faPhone, faPlusCircle, faPortrait,faArrowAltCircleRight,faThumbsUp, faSearch, faChevronDown, faChevronUp, faUpload, faSmileWink, faImage} from '@fortawesome/free-solid-svg-icons'
import Message from "../../components/message/Message";
import {findIndexLastTextSeen,addSpantoText,findIndexFromArrayLodash, findObjectFromArrayLodash} from '../../helper/function'
import { useEffect, useRef, useState } from "react";
import {useParams,useHistory} from "react-router-dom";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash';
import ContainerRight from '../containerRight/ContainerRight'
import SearchMess from '../searchMess/searchMess'
import UploadFile from '../UploadFile/UploadFile';
import { format } from "timeago.js";
import './containermess.css'
import Gifphy from '../Gifphy/Gifphy';
library.add(fab,faPhone,faInfoCircle,faPlusCircle,faPortrait,faAirFreshener,faGift,
  faArrowAltCircleRight,faThumbsUp,faSearch,faChevronDown,faChevronUp,faUpload,faSearch,faSmileWink,faImage) 

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
    const history = useHistory(); 
    const [files,setFiles] = useState([]);
    const [openGif, setOpenGif] = useState(false);
    const [profileFriend,setProfileFriend] = useState({});
    //set ProfileFriend
    useEffect(() => {
      if(!_.isEmpty(currentConversation)) {
        const sizeUserInRoom = _.size(currentConversation.members) > 2 ? true:false;
        
        if(sizeUserInRoom) {
          const status = _.size(currentConversation.members.filter(value => value.id != AuthStore.user._id && value.status)) >=2 ? true : false;
          setProfileFriend({
            username: currentConversation.name,
            profilePicture: currentConversation.covImage,
            status
          })
        } else {
          const [userProfile] = currentConversation.members.filter(value => value.id != AuthStore?.user._id);
          setProfileFriend(userProfile); 
        }
      }
    },[currentConversation])


    useEffect(() => {
        ActionStore.action_setCurrentConversation(conversationId);
    },[conversationId])

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
        // try {

          const statusSeen = currentConversation.lastText.seens;
          const seen = statusSeen.filter(value => value.joinRoom == true && value.id != AuthStore.user._id);
          console.log(statusSeen);
          console.log(seen);

      //     if(newMessage != "") {
      //       const message = {
      //         sender: user._id,
      //         text: JSON.stringify(newMessage),
      //         conversationId: covId,
      //         seens: statusSeen,
      //         seen: !_.isEmpty(seen),
      //       };
      //       const res = await ActionStore.action_saveMessage(message);
      //       const {conversationId,...lastText} = message;
      //       if(indexConversation !== null){
      //         ActionStore.action_setConverSationByIndex({updatedAt: Date(Date.now()),lastText}, indexConversation);
      //       }
         
      
      //       AuthStore.socket?.emit("sendMessage", res);
      //       setMessages([...messages, res]);
      //       setNewMessage("");
      //     }
          



      //         if(!_.isEmpty(AuthStore.textFile)) {

               

      //           const message = {
      //             sender: user._id,
      //             text: JSON.stringify(AuthStore.textFile),
      //             conversationId: covId,
      //             seens: statusSeen,
      //             seen: !_.isEmpty(seen),
      //           };
      //           const res = await ActionStore.action_saveMessage(message);
      //           const {conversationId,...lastText} = message;
      //           if(indexConversation !== null){

      //             ActionStore.action_setConverSationByIndex({updatedAt: Date(Date.now()),lastText}, indexConversation);
      //           }
      //           AuthStore.socket?.emit("sendMessage", res);

      //           AuthStore.action_resetTextFile(); 
      //           setMessages([...messages, res]);
      //           setFiles([]);
      //         }
      //  } catch(err) {
      //       console.log(err);
      // }

      };

      //Gif Text

      useEffect(() => {
        if(AuthStore.textGif)  setMessages([...messages, AuthStore.textGif]);
      },[AuthStore.textGif])
      /// call video
      const handleCallVideo =  () => {
        window.open(`http://localhost:3000/callvideo?from=${user._id}&room=${conversationId}&status=${0}`)
      }

      // Files

      const handleFiles = (e) => {
        AuthStore.action_uploadFile(Object.values(e.target.files));

        const file = Object.values(e.target.files).map((value,index) => {
          value.preview = URL.createObjectURL(value)
          value.id = Date.now() + "_" +index;
          return value;
        })

        setFiles([...files,...file]);
      }

      const handleShowRightConversation = () => {
        AuthStore.action_setActiveContainer();
        }
      // set arrives message
      useEffect(() => {
        arrivalMessage && 
        !_.isEmpty( currentConversation?.members.filter(value => value.id == arrivalMessage.sender)) &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage]);

      useEffect(() => {
        AuthStore.socket?.on("getMessage", (data) => {
           setArrivalMessage(data);
         });
       }, []);
      


       //search mess
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
    },[currentConversation])

  const handleJoinRoom = async (conversation) => {
    try {
      console.log("action join room");
     AuthStore.socket?.emit("join_room", {senderId: AuthStore?.user._id, conversationId: conversation._id})
     ActionStore.action_updateStatusSeenSelf({conversationId: conversation._id,senderId: AuthStore?.user._id}); 
     
   } catch (err) {
     console.log(err);
   }
     
}

//SELFIE 
 const handleSelfie = () => {
   history.push('/camera')
 }

//Out room
  useEffect(() => {
    return () => {
      console.log("out this room: ", conversationId);
    conversationId &&  handleOutComponent();
    }
  },[conversationId])

  const handleOutComponent = async () => {
    // if(currentConversation.current !== null) {
        try {
            const conversations = findObjectFromArrayLodash(ActionStore.conversations, {_id: conversationId});
            const friendId = conversations.members.find((m) => m.id !== AuthStore.user?._id);
            const res = await ActionStore.action_getProfile(friendId.id);
            // ActionStore.action_updateConversationSeenOutRoomSeft(conversationId);
            AuthStore.socket?.emit("out_room",  {senderId: AuthStore.user._id, conversationId: conversations._id});

          } catch(err) {
            console.log(err);
          }
    // }
  }

//send mess by enter
// const handleSendMessByEnter = (e) => {
//   if(e.which == 13) {

//   }
// }


//get gifphy list
  const handleGetGifphyList = () => {
    setOpenGif(!openGif);
  }

  useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const cancel =  (index) => {
    const result = files.filter(value => value.id != index);
    setFiles([...result]);
  }

    return (
        <>
            <div className="container-main">
                    <div className="container-main__head">
                        <div className="container-main__head-left">
                            <div className="container-main__head-left-avt">
                                <img className="container-main__head-left-avt-img avt-mess" src={
                                    profileFriend?.profilePicture
                                        ? profileFriend?.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" />
                            </div>
                            <span className={profileFriend?.status ? "status_active1":""}></span>
                            <div className="container-main__head-left-info">
                                <div className="container-main__head-left-info__name name-mess">
                                    {profileFriend?.username}
                                </div>
                                <div className="container-main__head-left-info-time online">
                                    
                                    <span>{profileFriend.status?"Đang hoạt động":`Hoạt động cách đây ${format(currentConversation?.updatedAt)}`}</span>
                                    
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
                                    profileFriend?.profilePicture
                                        ? profileFriend?.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" className="no-content__img avt-mess" />
                            </div>
                            <div className="no-content__info">
                                <div className="no-content__info-name name-mess">
                                {profileFriend?.username} 
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
                                                    seen={m.seen}
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
                                <FontAwesomeIcon icon={faPlusCircle} />
                            </div>
                            <div className="container-main__bottom-left-icon hide" onClick={handleSelfie}>
                                <FontAwesomeIcon icon={faPortrait} />
                            </div>
                            <label for="upload_files" className="container-main__bottom-left-icon hide">
                            
                                <FontAwesomeIcon icon={faImage} />
                            </label>
                            <div className="container-main__bottom-left-icon hide container-main__bottom-left-icon-gifphy">
                                {openGif && <Gifphy currentConversation={currentConversation} indexCov={indexConversation}/> }
                              <FontAwesomeIcon icon={faGift} onClick={handleGetGifphyList}/>
                            </div>
                        </div>
                        <div className="container-main__bottom-search">
                          
                                    {!_.isEmpty(files) && 
  
                                      <div className="container-main__bottom-search-multi-input-upload">
                                       {console.log(files)}
                                        {
                                          files.map((value, index) => {
                                            return (
                                              <UploadFile file={value}  cancel={cancel} indexs={index}/>
                                            );
                                          })
                                        }
                                        
        
                                        <label for="upload_files">
                                          <FontAwesomeIcon icon={faUpload} />
                                        </label>
                                    
                                    </div>
                                    
                                    }
                                    <span className="dragBox" hidden>
                                          <input type="file" multiple onChange={handleFiles} id="upload_files" />
                                        </span>
                              
                              
                              <input type="text" placeholder="Aa" className="container-main__bottom-search-input"  
                              onChange={(e) => setNewMessage(e.target.value)}
                              value={newMessage}
                              // onKeyPress={handleSendMessByEnter}
                              />
                              
                            <div className="container-main__bottom-search__icon">
                            <FontAwesomeIcon icon={faSmileWink} />
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
                            {/* <div className="container-main__bottom-thumb-up">
                                <FontAwesomeIcon icon={faThumbsUp} />
                            </div> */}
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