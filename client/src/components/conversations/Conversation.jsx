import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./conversation.css";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash'

const Conversation = observer(({ conversation, currentUser,index }) => {
  const ActionStore = useStore('ActionStore');
  const AuthStore = useStore('AuthStore');
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {offlineStatus} = ActionStore;
  const ref = useRef(null);

  useEffect(() => {
    

    const getUser = async () => {
      try {
        const friendId = conversation.members.find((m) => m !== currentUser._id);
        // const res = await axios("/users?userId=" + friendId);
        const res = await ActionStore.action_getProfile(friendId);
 
        setUser(res);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation,offlineStatus]);

  useEffect(() => {
    if(!_.isEmpty(user)) {
      user?.status ? ref.current.classList.add("conversationTrue") : ref.current.classList.remove("conversationTrue");

    }
  },[user]);

  useEffect(() => {
    console.log( AuthStore.socket);
    AuthStore.socket?.on("setUserOffline", (userId) => {

     ActionStore.action_setOfflientStatus();
    })
    AuthStore.socket?.on("setOnline", () => {
     ActionStore.action_setOfflientStatus();
    })
   
 },[]);
  return (
    <>
    
    <div className="conversation" ref={ref}>
      <img
        className="conversationImg"
        src={
          user?.profilePicture
            ? user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""
      />
      <div className="conversation-text">
      {console.log(ActionStore.lastText[index]?.lastText?.text)}
        <span className="conversationName">{user?.username}</span>
        <span className="conversationName1">{ActionStore.lastText[index]?.lastText?.sender === currentUser._id &&  !_.isEmpty(conversation?.lastText) 
        ? `You: ${ActionStore.lastText[index].lastText?.text}` 
        : !_.isEmpty(ActionStore.lastText[index]?.lastText?.text) 
        ? `${ActionStore.lastText[index]?.lastText?.text}`: ""}</span>
        {/* <span>{ActionStore.lastText[index]?.lastText?.text}</span> */}
        
      </div>
      
    </div>
    </>
  );
});
export default Conversation;
  

