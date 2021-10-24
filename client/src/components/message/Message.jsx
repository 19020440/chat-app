import "./message.css";
import { format } from "timeago.js";
import {useStore} from '../../hook'
import { useEffect, useState } from "react";
import {observer} from 'mobx-react-lite'
import _ from "lodash";

const  Message = observer(({ message, own,seen,lastTextSeen}) => {
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [isText, setIsText] = useState(false);
  const [isFile,setIsFile] = useState(false);
  useEffect(() => {
    const text = JSON.parse(message.text)
    if(!_.isArray(text)) {
      setIsText(true);
    } else setIsFile(true);
  },[])
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
          {isText && <p className="messageText">{JSON.parse(message.text)}</p>}
          {isFile && 
            JSON.parse(message.text).map((value) => {
              return (
                <img src={value} className="mess_file"/>
              )
            })
          
          }
          {/* {message.sender == AuthStore.user._id && !_.isEmpty(ActionStore.lastText) && seen &&
            <> 
            
            <img src={ActionStore.profileOfFriend.profilePicture} alt="" />
            
            </>
          } */}
          {lastTextSeen && message.sender == AuthStore.user._id &&
            <><img src={ActionStore.profileOfFriend.profilePicture} alt="" className="image_text"/></>
          }
          {!seen && message.sender == AuthStore.user._id &&
            <>
            {/* <img src="https://img.icons8.com/material-outlined/13/000000/ok.png"/>  */}
            <img className="image_text" src="https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/13/000000/external-check-multimedia-kiranshastry-gradient-kiranshastry.png"/>
            
            </>
           } 
          
        </div>
       
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}) 

export default Message;
  

