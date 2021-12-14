 import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faAirFreshener, faGift, faInfoCircle, faPhone, faPlusCircle, faPortrait,faArrowAltCircleRight,faThumbsUp, faSearch, faChevronDown, faChevronUp, faUpload, faSmileWink, faImage} from '@fortawesome/free-solid-svg-icons'
import Message from "../../components/message/Message";
import {findIndexLastTextSeen,addSpantoText,findIndexFromArrayLodash, findObjectFromArrayLodash,ValidateListFriend} from '../../helper/function'
import { useEffect, useRef, useState } from "react";
import {useParams,useHistory} from "react-router-dom";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import {message, Modal, Tooltip} from 'antd'
import _ from 'lodash';
import ContainerRight from '../containerRight/ContainerRight'
import SearchMess from '../searchMess/searchMess'
import UploadFile from '../UploadFile/UploadFile';
import { format } from "timeago.js";
import './containermess.css'
import Gifphy from '../Gifphy/Gifphy';
import Emoji from '../Emoji/Emoji';
import ListNotify from '../ListNotify/ListNotify';
import Camera from '../camera/Camera';
import { AuthStore } from '../../Store/AuthStore';

library.add(fab,faPhone,faInfoCircle,faPlusCircle,faPortrait,faAirFreshener,faGift,
  faArrowAltCircleRight,faThumbsUp,faSearch,faChevronDown,faChevronUp,faUpload,faSearch,faSmileWink,faImage) 


  const requestRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    return new MediaRecorder(stream);
  }
const ContrainerMess = observer((props) => {
    const [showSelfie, setShowSelfie] = useState(false);
    const AuthStore = useStore('AuthStore')
    const ActionStore = useStore('ActionStore');
    const [messages, setMessages] = useState([]);
    const {conversationId} = useParams();
    const covId = conversationId;
    const {showListNotify} = AuthStore;
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
    const [openEmoji, setOpenEmoji] = useState(false);
    const [profileFriend,setProfileFriend] = useState({});
    const emojiRef = useRef(null);
    const [statusJoin, setStatusJoin] = useState(false);
    const [showModalProfile, setShowModalProfile] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioData, setAudioData] = useState(null);
    const videoRef = useRef();
    const [changeMess, setChangeMess] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [intervalTime, setIntervalTime] = useState(null);
    const handleRecord = () => {
      if (!isRecording) {
        let interval = setInterval(() => {
          setRecordTime(recordTime => {
            return recordTime += 1
          });
  
        }, 1000);
        setIntervalTime(interval);
      } else {
        setIntervalTime(clearInterval(intervalTime))
      }
      setIsRecording(!isRecording)
    }
  
    const handleCancelRecord = (e) => {
      e.preventDefault();
      setIsRecording(false);
      setRecorder(null);
      setAudioData(null);
      setIntervalTime(clearInterval(intervalTime))
      setRecordTime(0);
    }


    useEffect(() => {
      // Lazily obtain recorder first time we're recording.
      if (recorder === null) {
        if (isRecording) {
          requestRecorder().then(setRecorder, (error) => {
            console.log(error);
          });
        }
        return;
      }
  
      // Manage recorder state.
      if (isRecording) {
        recorder.start();
      } else {
        recorder.stop();
        // setRecorder(null);
      }
  
      // Obtain the audio when ready.
      const handleData = e => {
        console.log(e.data)
        setAudioData(e.data);
      };
  
      recorder.addEventListener("dataavailable", handleData);
      return () => recorder.removeEventListener("dataavailable", handleData);
    }, [recorder, isRecording]);

    const getEmoji = (emoji) => {
      setNewMessage(text => text + emoji);
    }
    //set ProfileFriend
    useEffect(() => {
      if(!_.isEmpty(currentConversation)) {
        const sizeUserInRoom = currentConversation.name ? true:false;
        
        if(sizeUserInRoom) {
          const status = _.size(currentConversation.members.filter(value => value.id != user._id && value.status)) >=1 ? true : false;
          setProfileFriend({
            username: currentConversation.name,
            profilePicture: currentConversation.covImage,
            status,
            isGroup: true,
            size: _.size(currentConversation.members),
          })
        } else {
          const [userProfile] = currentConversation.members.filter(value => value.id != AuthStore?.user._id);
          setProfileFriend(userProfile); 
        }
      }
    },[currentConversation, ActionStore.answerJoinRoom])


    useEffect(() => {
        ActionStore.action_setCurrentConversation(conversationId);
    },[conversationId])

    /// get message

    useEffect(() => {
      AuthStore.socket.on("gotinnhan", data => {
        if(data?.covId == covId) getMessages();
      })
    }, [])
    useEffect(() => {
       getMessages(); 
      }, [AuthStore.statusSeenText, statusJoin]);
      const getMessages = async () => {
        try {
          const res = await ActionStore.action_getAllMessageOfConversation(conversationId)
          setMessages(res);
          if(!statusJoin) {
            const lastMess = _.last(res);
            const result = await ActionStore.action_updateLastMess({messId: lastMess?._id, userId: AuthStore?.user?._id});
            if(result){
              handleJoinRoom(currentConversation);
              setStatusJoin(true);
            }
          }
          
          
        } catch (err) {
          console.log(err);
        }
      };
      //send message
      const handleSubmit = async (e) => {
        // e.preventDefault();
        try {

          const statusSeen = currentConversation.lastText.seens;
          const seen = statusSeen.filter(value => value.joinRoom == true && value.id != AuthStore.user._id);

          if(newMessage != "") {
            const message = {
              sender: user._id,
              text: JSON.stringify(newMessage),
              conversationId: covId,
              seens: statusSeen,
              seen: !_.isEmpty(seen),
            };
            const res = await ActionStore.action_saveMessage(message);
            const {conversationId,...lastText} = message;
            if(indexConversation !== null){
              ActionStore.action_setConverSationByIndex({updatedAt: Date(Date.now()),lastText}, indexConversation);
            }
         
      
            AuthStore.socket?.emit("sendMessage", res);
            setMessages([...messages, res]);
            setNewMessage("");
          }
          console.log(AuthStore.textFile);
            if(!_.isEmpty(AuthStore.textFile)) {

              const message = {
                sender: user._id,
                text: JSON.stringify(AuthStore.textFile),
                conversationId: covId,
                seens: statusSeen,
                seen: !_.isEmpty(seen),
              };
              const res = await ActionStore.action_saveMessage(message);
              const {conversationId,...lastText} = message;
              if(indexConversation !== null){

                ActionStore.action_setConverSationByIndex({updatedAt: Date(Date.now()),lastText}, indexConversation);
              }
              AuthStore.socket?.emit("sendMessage", res);

              AuthStore.action_resetTextFile(); 
              setMessages([...messages, res]);
              setFiles([]);
            }
             
       } catch(err) {
            console.log(err);
      }

      };

      //Gif Text
      useEffect(() => {
        if(AuthStore.textGif)  setMessages([...messages, AuthStore.textGif]);
      },[AuthStore.textGif])
      /// call video
      const handleCallVideo =  () => {
        window.open(`/callvideo?from=${user._id}&room=${conversationId}&status=${0}`)
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
        arrivalMessage.conversationId == covId &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage]);

      useEffect(() => {
        AuthStore.socket?.on("getMessage", (data) => {
           setArrivalMessage(data);
         });
       }, []);
      


       //search mess
       useEffect(() => {
         try {
            if(AuthStore.stt !==null) {
              let spanText = document.querySelectorAll('.hight_light-text');
              if(!_.isEmpty( spanText))   spanText.forEach(value => {
                value.classList.remove("hight_light-text");
              })
              let result =  document.getElementById(`mess${AuthStore.stt}`);
              const text =  result.querySelector('.messageText').innerHTML;
              result.querySelector('.messageText').innerHTML = addSpantoText(text,AuthStore.textSearch)
              document.getElementById(`mess${AuthStore.stt != 0 ? AuthStore.stt-1 : 0}`).scrollIntoView();  
            } else {
              let spanText = document.querySelectorAll('.hight_light-text');
              spanText.forEach(value => {
                console.log(value);
                value.classList.remove("hight_light-text");
              })
              
            }
         } catch(err) {
           console.log(err);
         }
       
       },[AuthStore.stt])

    //Join Room 
    // useEffect(() => {
    //   // if(!_.isEmpty(currentConversation)) {
    //   // handleJoinRoom(currentConversation);
    //   // }
    // },[conversationId])

  const handleJoinRoom = async (conversation) => {
    const userId = AuthStore?.user._id;
    try {
     AuthStore.socket?.emit("join_room", {senderId: userId, conversationId: covId})
     ActionStore.action_updateStatusSeenSelf({conversationId: covId,senderId: userId}); 
     
   } catch (err) {
     console.log(err);
   }
     
}

//SELFIE 
 const modalSelfie = (isModalVisible) => {
    const handleOk = async () => {
        const src = await AuthStore.action_selfie(videoRef.current.newSrc.split(',')[1]);
        const statusSeen = currentConversation.lastText.seens;
        const seen = statusSeen.filter(value => value.joinRoom == true && value.id != AuthStore.user._id);
          const message = {
            sender: user._id,
            text: JSON.stringify([src]),
            conversationId: covId,
            seens: statusSeen,
            seen: !_.isEmpty(seen),
          };
          const res = await ActionStore.action_saveMessage(message);
          const {conversationId,...lastText} = message;
          if(indexConversation !== null){
            ActionStore.action_setConverSationByIndex({updatedAt: Date(Date.now()),lastText}, indexConversation);
          }
          AuthStore.socket?.emit("sendMessage", res);
          setMessages([...messages, res]);
          videoRef.current.srcObject.getTracks()[0].stop();
        setShowSelfie(false);
        // videoRef.current.srcObject.getTracks()[0].stop();
    }
    const handleCancel = () => {
      setShowSelfie(false);
     videoRef.current.srcObject.getTracks()[0].stop();
    //  const formData = new FormData();
    //  formData.append('base', videoRef.current.newSrc.split(',')[1])
    //  fetch('http://localhost:8800/api/upload', {
    //    method: 'post',
    //    body: formData,
    //   //  headers: {
    //   //    'Content-Type': 'multipart/form-data'
    //   //  }
    //  }).then(res => {
    //    console.log(res);
    //  })
    } 
    return (
      <Modal 
        title={<></>} 
        visible={isModalVisible} 
        onOk={handleOk} 
        okText="Gửi"
        cancelText="Đóng"
        onCancel={handleCancel}
        bodyStyle={{width: '500px', height: '520px', padding: '12px'}}
      >
        <Camera status={showSelfie} videoRef={videoRef}/>
      </Modal>
    )
 }
 const getVideo = () => {
  navigator.mediaDevices.getUserMedia({
      video: {width: 500, height: 500}
  })
  .then((stream) => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
  })
  .catch(err => {
      console.log(err);
  })
}
//Out room
  useEffect(() => {
    return () => {
      console.log("out this room: ", conversationId);
      setMessages([]);
      setStatusJoin(false);
   
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

  //EMOJI
  const handleShowEmoJi = () => {
    // const element =   emojiRef.current.getAttribute("class");
    // if(element.indexOf("hidden_icon") != -1) {
    //   emojiRef.current.classList.remove("hidden_icon");
    // } else emojiRef.current.classList.add("hidden_icon");
    setOpenEmoji(!openEmoji)
  }

  useEffect(() => {
    return () => {
      setMessages([]);
    }
  },[])



  //user Profile

  const profileModal = (visible) => {

    const handleOutProfile = () => {
      setShowModalProfile(false);
    }
    return (
      <Modal
      title="Thông tin cá nhân"
      visible={visible}
      // confirmLoading={confirmLoading}
      onCancel={handleOutProfile}
      className="modal_profile"
      >
        
    <div class="card">
      <div class="banner" style={{position: 'relative'}}>
         <img src={profileFriend.profilePicture ? profileFriend.profilePicture : PF + "person/noAvatar.png"} alt="" />
      </div>
      <div class="menu">
        <div class="opener"><span></span><span></span><span></span></div>
      </div>
      <h2 class="name">{profileFriend.username}</h2>
      <div class="actions">
        <div class="follow-info">
          {/* {/* <h2><a href="#"><span>12</span><small>Followers</small></a></h2> */}
          {profileFriend.isGroup && <h2><a href="#"><span>{profileFriend.size}</span><small>Thành viên</small></a></h2> }
        </div>
        <div class="follow-btn">
          {!profileFriend.isGroup &&<button onClick={async () => {
            if(ValidateListFriend(profileFriend.id, AuthStore.listFollow)) {
              const result = await AuthStore.action_removeFriend(profileFriend.id, covId);

              if(result) {
                const status = ActionStore.action_deleteConversation(covId);
                status && message.success("Đã hủy kết bạn!");
                AuthStore.action_removeListFollow(profileFriend.id)
                history.push('/messenger')
              }
            } else {
              try {
                const res = await AuthStore.action_addFriend(true, profileFriend.id);
                if(res) {
                  const  saveNotify = await ActionStore.action_saveNotify({userId: profileFriend.id, profilePicture: AuthStore?.user?.profilePicture, 
                    des: `${AuthStore?.user?.username} đã kết bạn với bạn`});
                  if(saveNotify) {
                    AuthStore?.socket?.emit("invite_success", saveNotify)
                    AuthStore.action_setListFollow(profileFriend.id)
                    AuthStore.action_addUser();
                  }
                }
              } catch(err) {
                console.log(err);
              }
            }
          }}>{ValidateListFriend(profileFriend.id, AuthStore.listFollow) ? "Hủy kết bạn" : "Kết bạn"}</button>}
          {profileFriend.isGroup && <button>Thông tin nhóm</button>}
        </div>
      </div>
      <div class="desc">{profileFriend.username} has collected ants since they were six years old and now has many dozen ants but none in their pants.</div>
    </div>

     
  </Modal>
    )
  }
    return (
        <>
            <div className="container-main">
                    <div className="container-main__head">
                        <div className="container-main__head-left">
                            <div className="container-main__head-left-avt" onClick={() => {
                              setShowModalProfile(true);
                            }}>
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
                                    
                                    <span>{profileFriend.status?"Đang hoạt động":`Không hoạt động`}</span>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="container-main__head-right">
                            <div className="container-main__head-right-btn">
                                {/* <FontAwesomeIcon icon={faPhone} style={{transform: `rotate(90deg)`}}/> */}
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
                                    Các bạn là bạn bè trên social app 
                                </div>
                            </div>
                        </div>
                            <ul className="container-main__list">
                              {console.log(!AuthStore.showListNotify)}
                                {!AuthStore.showListNotify ? 
                                    messages.map((m, index) => {
                                        return (
                                            <li className="container-main__item1" ref={scrollRef} id={`mess${index}`} key={m._id}>
                                                <Message message={m} own={m.sender === user._id} 
                                                    // seen={(index == (_.size(messages)-1)) && m.seens ? true:false}
                                                    seen={m.seen}
                                                    lastTextSeen = {findIndexLastTextSeen(messages) == index ? true:false}
                                                    onChangeMess={setChangeMess}
                                                    statusMess={changeMess}
                                                    onChangAllMess={setMessages}
                                                    currentCov={covId}
                                                />
                                            </li>
                                        );
                                    }) :
                                    <ListNotify />
                               }
                                 
                            </ul>
                    </div>
                    <div className="container-main__bottom">
                      
                        <div className="container-main__bottom-left">
                            <div className="container-main__bottom-left-icon">
                                <Tooltip title="Ghi âm"> 
                                  <FontAwesomeIcon icon={faPlusCircle} onClick={handleRecord}/>
                                </Tooltip>
                                
                            </div>
                            <div className="container-main__bottom-left-icon hide" onClick={() => {
                              getVideo();
                              setShowSelfie(true)}
                            }>
                                <Tooltip title="Chụp ảnh"> 
                                  <FontAwesomeIcon icon={faPortrait} />
                                </Tooltip>
                            </div>
                            <label for="upload_files" className="container-main__bottom-left-icon hide container-upload-label">
                                <Tooltip title="Gửi file hoặc ảnh"> 
                                  <FontAwesomeIcon icon={faImage} />
                                </Tooltip>
                                
                            </label>
                            <div className="container-main__bottom-left-icon hide container-main__bottom-left-icon-gifphy">
                                {openGif && <Gifphy currentConversation={currentConversation} indexCov={indexConversation} /> }
                                <Tooltip title="Gửi GIF"> 
                                  <FontAwesomeIcon icon={faGift} onClick={handleGetGifphyList} />
                                </Tooltip>
                               
                            </div>
                        </div>
                        <div className="container-main__bottom-search">
                          
                                    {!_.isEmpty(files) && 
  
                                      <div className="container-main__bottom-search-multi-input-upload">
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
                              onKeyPress={(e) => {
                                if(e.which == 13) handleSubmit();
                              }}
                              onFocus={() => {
                                setOpenGif(false);
                                setOpenEmoji(false)
                              }}
                              />
                              
                            <div className="container-main__bottom-search__icon" >
                              <FontAwesomeIcon icon={faSmileWink} onClick={handleShowEmoJi}/>
                                <div className="container-main__bottom-search__list-icon">
                                    {openEmoji && <Emoji getText={getEmoji}/>}
                                   
                                </div>
                            </div>
                        </div>
                        <div className="container-main__bottom-right">
                            <div className="container-main__bottom-send"  onClick={handleSubmit}>
                                
                                <Tooltip title="Gửi tin nhắn"> 
                                  <FontAwesomeIcon icon={faArrowAltCircleRight} />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
        
                <ContainerRight infoRoom={profileFriend} members={currentConversation?.members} messenger={messages}/>
                {profileModal(showModalProfile)}
                {modalSelfie(showSelfie)}
        </>
    );
})

export default ContrainerMess;