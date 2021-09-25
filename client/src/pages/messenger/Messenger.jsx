import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash';
import Search from '../../components/searchFriend/search'
const Messenger = observer(() => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const [startSearch, setStartSeaerch] = useState(false);
  const [currentChatSearch, setCurrentChatSearch] = useState({});
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');
  const {user} = AuthStore;
  const scrollRef = useRef();
  const ref = useRef(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {listSearch} = ActionStore;
  const showRef = useRef(null);
  const currentLastText = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:8800");
    AuthStore.action_setSocket(io("http://localhost:8800"));
    socket.current.on("getMessage", (data) => {
      ActionStore.action_setLastTextByIndex(
        {_id: currentChat?._id,
           lastText: {
            sender: data.senderId,
            text: data.text,
           }
          
        }, currentLastText.current);
        console.log(currentLastText.current);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    console.log(socket.current);
    socket.current.emit("addUser", user._id);
    // socket.current.on("getUsers", (users) => {
    //   setOnlineUsers(
    //     user.followings.filter((f) => users.some((u) => u.userId === f))
    //   );
    // });
  }, [user]);
  // GETCONVERSATION
  useEffect(() => {
    const getConversations = async () => {
      if(!_.isEmpty(user)) {
        try {
          // const res = await axios.get("/conversations/" + user._id);
          const res = await ActionStore.action_getConversation(user._id);
          ActionStore.action_setLastText(res);
          setConversations(res);
        } catch (err) {
          console.log(err);
        } 
      }
      
    };
    getConversations();
  }, [user]);

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
    if(!_.isEmpty(currentChat))  {
      getMessages();
      profileFriend();
    }
  }, [currentChat]);

  const profileFriend = async () => {
    // ActionStore.action_setProfileOfFriend("");
    const friendId = currentChat.members.find((m) => m !== user._id); 
      try {
        const res = await ActionStore.action_getProfile(friendId);
        console.log(res);
        ActionStore.action_setProfileOfFriend(res);
      } catch (err) {
        console.log(err);
      }
  }
  

 
  const getMessages = async () => {
    try {
      const res = await ActionStore.action_getAllMessageOfConversation(currentChat._id)
      setMessages(res);
    } catch (err) {
      console.log(err);
    }
  };
  //Seaerch Frieng
  const handleSearchFriend = async (e) => {  
    await ActionStore.action_searchFriend(e.target.value);

  }
  //Send MEssage

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const {conversationId,...lastText} = message;
    console.log(currentLastText);
    if(currentLastText.current !== null) ActionStore.action_setLastTextByIndex({_id: conversationId, lastText}, currentLastText.current); 

    

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      // const res = await axios.post("/messages", message);
      const res = await ActionStore.action_saveMessage(message);
      setMessages([...messages, res]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  //Handle Click OUstside
  // useEffect(() => {
  //   const checkIfClickedOutside = async (e) => {
  //     // If the menu is open and the clicked target is not within the menu,
  //     // then close the menu
  //     setStartSeaerch(false)
  //     if (startSearch && ref.current && !ref.current.contains(e.target)) {
  //       console.log("end");
  //       setStartSeaerch(false)
  //     }
  //   }

  //   document.addEventListener("mousedown", checkIfClickedOutside)

  //   return () => {
  //     // Cleanup the event listener
  //     document.removeEventListener("mousedown", checkIfClickedOutside)
  //   }
  // }, [startSearch])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartSearch = () => {
    setStartSeaerch(true);
  }

  //Show rightbar
  const handleShowRightBar = () => {
    const element = showRef.current.getAttribute("class");
    if(element.indexOf("hid") != -1) {
      showRef.current.classList.remove("hid");
    } else showRef.current.classList.add("hid");
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
                <img src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/15/000000/external-back-arrow-basic-ui-elements-flatart-icons-outline-flatarticons.png" className="chatMenuWrapper-toolbar_search_back"/>
                <img src="https://img.icons8.com/ios-glyphs/15/000000/search--v1.png"/>
                <input placeholder="Search for friends" className="chatMenuInput" onChange={handleSearchFriend} onClick={handleStartSearch} ref={ref}/>
              </div>
             
            </div>
           
           <div className="chatMenuWrapper-list">
            {startSearch ? _.isEmpty(listSearch) ? null : listSearch.map((user) => (
                <div onClick={() => setCurrentChatSearch(user)}>
                  <Search user={user} />
                </div>
              ))
              :conversations.map((c, index) => (
                <div onClick={() => {
                  setCurrentChat(c);
                  currentLastText.current = index;
                }
                }>
                  <Conversation conversation={c} currentUser={user} index={index}/>
                </div>
              ))}
           </div>
           
          </div>
        </div>

        
        <div className="chatBox">
          <div className="chatBoxWrapper">
            
            {currentChat ? (
              <>
              <div className="chatBoxWrapper-navbar">
                {console.log(ActionStore.profileOfFriend?.status)}
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
                  {messages.map((m) => (
                    <div>
                      <Message message={m} own={m.sender === user._id} />
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
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
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
  
