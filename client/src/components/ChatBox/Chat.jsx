import React, {useEffect, useState, useRef} from 'react';
import { useParams } from 'react-router-dom';
import {observer} from 'mobx-react-lite'
import {useStore} from '../../hook'
import _ from 'lodash'
import './chat.css';
import {findIndexFromArrayLodash, findIndexLastTextSeen} from '../../helper/function'
import Message from '../message/Message';
const Chat = observer(() => {
    const AuthStore = useStore('AuthStore')
    const ActionStore = useStore('ActionStore');
    const [messages, setMessages] = useState([]);
    const {conversationId} = useParams();
    const covId = conversationId;
    const {user} = AuthStore;
    const indexConversation = findIndexFromArrayLodash(ActionStore.conversations, {_id: conversationId});
    const currentConversation = ActionStore.conversations[indexConversation];
    const showRef = useRef(null);
    const [newMessage, setNewMessage] = useState("");
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [arrivalMessage,setArrivalMessage]= useState(null)


    useEffect(() => {
      if(findIndexFromArrayLodash != -1) {
        ActionStore.action_setCurrentConversation(indexConversation);
      }
    },[indexConversation])

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
      // set arrives message
      useEffect(() => {
        arrivalMessage &&
        currentConversation?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage, currentConversation]);

      useEffect(() => {
        AuthStore.socket?.on("getMessage", (data) => {
           ActionStore.action_updateConnversationById({
             updatedAt:Date(data.updatedAt),
             lastText: {
               sender: data.senderId,
               text: data.text,
               seens: data.seens,
             }
           }, data.conversationId);
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
      
  //Show rightbar
  const handleShowRightBar = () => {
    const element = showRef.current.getAttribute("class");
    if(element.indexOf("hid") != -1) {
      showRef.current.classList.remove("hid");
    } else showRef.current.classList.add("hid");
  }



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


    return (
        <>
        <div className="chatBoxWrapper-navbar">
                <div className={`conversation ${ActionStore.profileOfFriend?.status ? "conversationTrue" : ""}`}>
                  <img
                    className="conversationImg"
                    src={
                      ActionStore.profileOfFriend.profilePicture
                        ?ActionStore.profileOfFriend.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                  />
                  <span className="conversationName">{ActionStore.profileOfFriend.username}</span>
               </div>

               <div className="chatBoxWrapper-navbar_tool">
                <img src="https://img.icons8.com/color/25/000000/phone-message--v2.png"/>
                <img src="https://img.icons8.com/ultraviolet/25/000000/video-call.png"/>
                <img src="https://img.icons8.com/ios-glyphs/25/000000/break.png" onClick={handleShowRightBar}/>
               </div>
              
            </div>

                <div className="chatBoxTop">
                  {messages.map((m,index) => (
                    <div>
                      <Message message={m} own={m.sender === user._id} 
                      // seen={(index == (_.size(messages)-1)) && m.seens ? true:false}
                      seen={m.seens}
                      lastTextSeen = {findIndexLastTextSeen(messages) == index ? true:false}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
                </>
    );
})

    


export default Chat;