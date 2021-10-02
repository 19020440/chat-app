import "./message.css";
import { format } from "timeago.js";
import {useStore} from '../../hook'
import { useEffect } from "react";
import {observer} from 'mobx-react-lite'
import _ from "lodash";

const  Message = observer(({ message, own,seen,lastTextSeen}) => {
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {message.sender !== AuthStore.user._id &&
        
          <>
            <img
            className="messageImg"
            src={
              ActionStore.profileOfFriend.profilePicture != "" ? ActionStore.profileOfFriend.profilePicture
              : PF + "person/noAvatar.png"
            }
        />
          </>
        
        }
        
        <div className="massafeTextAndSeen">
          <p className="messageText">{message.text}</p>
          {/* {message.sender == AuthStore.user._id && !_.isEmpty(ActionStore.lastText) && seen &&
            <> 
            
            <img src={ActionStore.profileOfFriend.profilePicture} alt="" />
            
            </>
          } */}
          {lastTextSeen && message.sender == AuthStore.user._id &&
            <><img src={ActionStore.profileOfFriend.profilePicture} alt="" /></>
          }
          {!seen && message.sender == AuthStore.user._id &&
            <>
            {/* <img src="https://img.icons8.com/material-outlined/13/000000/ok.png"/>  */}
            <img src="https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/13/000000/external-check-multimedia-kiranshastry-gradient-kiranshastry.png"/>
            
            </>
           } 
          
        </div>
       
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}) 

export default Message;
  

