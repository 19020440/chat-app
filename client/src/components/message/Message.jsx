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
              const arr = value.split('.');
              const arrName = value.split('_');
             
               if(arr[arr.length -1] == "pdf" || arr[arr.length -1] == "docx") return (
                <a href={value} className="mess_file" style={{width:50, height:50}}
                  onClick={(e) => {
                    e.preventDefault();
                    // e.target.download = arrName[arrName.length-1];
                  }}
                  download
                >{arrName[arrName.length-1]}</a>
              )

              else if(arr[arr.length -1] == "mp4" )  return (

                <video width="320" height="240" controls style={{width:150, height:150}}>
                  <source src={value} type="video/mp4"/>


                </video>
                
              )
              else  
              return (
                  <img src={value} className="mess_file"/>
                );
            })
          
          }
          {/* {message.sender == AuthStore.user._id && !_.isEmpty(ActionStore.lastText) && seen &&
            <> 
            
            <img src={message.senderImage } alt="" />
            
            </>
          } */}
          {lastTextSeen && message.sender == AuthStore.user._id &&
            <>
            {message.seens.map(value => {
              if(value.id != AuthStore.user._id)
              return (
                <img src={value.profilePicture} alt="" className="image_text"/>
              )
            })}
           
            </>
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
  

