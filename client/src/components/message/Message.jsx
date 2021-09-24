import "./message.css";
import { format } from "timeago.js";
import {useStore} from '../../hook'
import { useEffect } from "react";
import {observer} from 'mobx-react-lite'
import { defaultTo } from "lodash";
const  Message = observer(({ message, own }) => {
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    console.log(ActionStore.profilePicture);
  },[]);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          // src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          src={message.sender == AuthStore.user._id ? AuthStore.user.profilePicture 
            : ActionStore.profileOfFriend.profilePicture != "" ? ActionStore.profileOfFriend.profilePicture
            : PF + "person/noAvatar.png"
          }
          // alt=""
        />
        
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}) 

export default Message;
  

