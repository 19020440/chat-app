import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import {findIndexLastTextSeen,sortConversationByUpdateAt} from '../../helper/function'
import { useContext, useEffect, useRef, useState } from "react";
import { Switch, Route,Link, useParams} from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash';
import Search from '../../components/searchFriend/search'
import ChatBox from '../../components/ChatBox/Chat'
import ChatEmpty from "../../components/ChatEmpty/ChatEmpty";

const Messenger = observer(() => {
  const [currentChat, setCurrentChat] = useState(null);
  const [startSearch, setStartSeaerch] = useState(false);
  const [currentChatSearch, setCurrentChatSearch] = useState({});
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');
  const {user} = AuthStore;
  const ref = useRef(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {listSearch} = ActionStore;
  const showRef = useRef(null);
  const currentLastText = useRef(null);
  const out_room = useRef(null);
  const {conversations} = ActionStore;
  const conversationss = sortConversationByUpdateAt(conversations);

  console.log("this is conversation:", conversationss);
  // set Current_out_room
  useEffect(() => {
    if(ActionStore.currentConversation!=null||ActionStore.currentConversation != -1) {
      currentLastText.current = ActionStore.currentConversation;
    }
    

  },[ActionStore.currentConversation])
 
  
  //getConersationBySeaerch

  const getConversationBySearch = async () => {
    if(!_.isEmpty(currentChatSearch) && !_.isEmpty(user)) {
      const result = await ActionStore.action_getCovBySearch(user._id, currentChatSearch._id);
      if(!_.isEmpty(result)) setCurrentChat(result)
    }
  }

  useEffect(() => {
    getConversationBySearch();
  },[currentChatSearch])
 // GetAllMessageOfConversation


  useEffect(() => {
    profileFriend();
  },[currentChat,ActionStore.offlineStatus])

  const profileFriend = async () => {
    if(!_.isEmpty(currentChat)) {
      const friendId = currentChat.members.find((m) => m !== user._id); 
      try {
        const res = await ActionStore.action_getProfile(friendId);
        ActionStore.action_setProfileOfFriend(res);
      } catch (err) {
        console.log(err);
      }
    }
    
  }

  //Seaerch Frieng
  const handleSearchFriend = async (e) => {  
    await ActionStore.action_searchFriend(e.target.value);

  }

  const handleStartSearch = () => {
    setStartSeaerch(true);
  }
  // CANCEL SEARCH
  const handleCancelSearch = () =>  {
    setStartSeaerch(false);
  }
  console.log("re-render");
  //Show rightbar
  const handleShowRightBar = () => {
    const element = showRef.current.getAttribute("class");
    if(element.indexOf("hid") != -1) {
      showRef.current.classList.remove("hid");
    } else showRef.current.classList.add("hid");
  }
  // //Join Room 
  const handleOutRoom = async (conversation) => {
      console.log("out_room is: ", out_room.current);
      console.log("currentLatTest is: ",currentLastText.current);
      if(out_room.current !== currentLastText.current){
        console.log("OUt room");
        try {
          const conversations = ActionStore.conversations[out_room.current];
          const friendId = conversations.members.find((m) => m !== user._id);
          const res = await ActionStore.action_getProfile(friendId);
          ActionStore.action_updateConversationSeenOutRoomSeft(out_room.current);
          AuthStore.socket?.emit("out_room",  {socketId: res?.socketId, conversationId: conversations._id});

        } catch(err) {
          console.log(err);
        }
        
      }
 
  }

  return (
    
    <>
      <Topbar />
      <div className="messenger">

        <div className="chatMenu">
          <div className="chatMenuWrapper">
            
            <div className="chatMenuWrapper-toolbar row">
              <div className="chatMenuWrapper-toolbar_room">
                <span>CHAT</span>
                <div>
                  <img src="https://img.icons8.com/ios-glyphs/30/000000/ellipsis.png" className="imgCircle"/>
                  <img src="https://img.icons8.com/ios-filled/30/000000/video.png" className="imgCircle"/>
                  <img src="https://img.icons8.com/office/30/000000/note.png" className="imgCircle"/>
                </div>
              </div>

              <div className="chatMenuWrapper-toolbar_search">
                <img src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/15/000000/external-back-arrow-basic-ui-elements-flatart-icons-outline-flatarticons.png" className="chatMenuWrapper-toolbar_search_back" hidden={!startSearch} onClick={handleCancelSearch}/>
                <img src="https://img.icons8.com/ios-glyphs/15/000000/search--v1.png" hidden={startSearch}/>
                <input placeholder="Search for friends" className="chatMenuInput" onChange={handleSearchFriend} onClick={handleStartSearch} ref={ref}/>
              </div>
             
            </div>
           
           <div className="chatMenuWrapper-list">
            {startSearch ? _.isEmpty(listSearch) ? null : listSearch.map((user) => (
                <div onClick={() => setCurrentChatSearch(user)}>
                  <Search user={user} />
                </div>
              ))
              :conversationss.map((c, index) => (
                <Link onClick={async () => {
                  // setCurrentChat(c);
                  currentLastText.current = index;
                 await handleOutRoom(c);
                 out_room.current = index;
                }
                }
                to={`/messenger/${c._id}`}>
                  <Conversation conversation={c} currentUser={AuthStore.user} index={index} seen={c.lastText?.seens?true:false}/>
                </Link>
              ))}
           </div>
           
          </div>
        </div>

        
        <div className="chatBox">
          <div className="chatBoxWrapper">
              <Switch>
                <Route path="/messenger" exact component={ChatEmpty}/>
                <Route  path={`/messenger/:conversationId`}  exact component={ChatBox}/>

              </Switch>
          </div>
        </div>
        <div className="chatOnline" ref={showRef}>
          <div className="chatOnlineWrapper">
            {/* <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            /> */}
          </div>
        </div>
      </div>
    </>
    
  );
}) 

export default Messenger;
  
