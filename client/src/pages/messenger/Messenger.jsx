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
  const {listSearch} = ActionStore;

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
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
    socket.current.emit("addUser", user._id);
    // socket.current.on("getUsers", (users) => {
    //   setOnlineUsers(
    //     user.followings.filter((f) => users.some((u) => u.userId === f))
    //   );
    // });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      if(!_.isEmpty(user)) {
        try {
          // const res = await axios.get("/conversations/" + user._id);
          const res = await ActionStore.action_getConversation(user._id);
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

  useEffect(() => {
    if(!_.isEmpty(currentChat))  getMessages();
  }, [currentChat]);

  // GetAllMessageOfConversation
  const getMessages = async () => {
    try {
      // const res = await axios.get("/messages/" + currentChat?._id);
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

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" onChange={handleSearchFriend} onClick={handleStartSearch} ref={ref}/>
            {startSearch ? listSearch.map((user) => (
              <div onClick={() => setCurrentChatSearch(user)}>
                <Search user={user} />
              </div>
            ))
            :conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
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
        <div className="chatOnline">
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
  
