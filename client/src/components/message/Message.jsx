import "./message.css";
import { format } from "timeago.js";
import {useStore} from '../../hook'
import { useEffect, useState } from "react";
import {observer} from 'mobx-react-lite'
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { Row,Col } from "antd";
library.add(fab,faFile)

const  Message = observer(({ message, own,seen,lastTextSeen}) => {
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [isText, setIsText] = useState(false);
  const [isFile,setIsFile] = useState(false);
  const profileFriends = message.seens.filter(value => value.id == message.sender)
  const [profileFriend, setProfileFriend] = useState({});
  const lengText = _.size(JSON.parse(message.text));
  const text = JSON.parse(message.text)
  useEffect(() => {
    
    if(!_.isArray(text)) {
      setIsText(true);
    } else setIsFile(true);
  },[])
  useEffect(() => {
    if(!_.isEmpty(profileFriends)) setProfileFriend(profileFriends[0]);
    // console.log(JSON.parse(message.text));
  },[])
  return (
    <div className={own ? "message own" : "message notOwn"}>
      <div className="messageTop">
        {message.sender !== AuthStore.user._id &&
        
        <>
        <img
        className="messageImg"
        src={
          profileFriend.profilePicture != "" ? profileFriend.profilePicture
          : PF + "person/noAvatar.png"
        }
    />
      </>
        
        }
        
        <Row className="massafeTextAndSeen">
          {isText && <p className="messageText">{JSON.parse(message.text)}</p>}
          {isFile && 
            text.map((value) => {
              const arr = value.split('.');
              const arrName = value.split('_');
             
              if(arr[arr.length -1] == "pdf" || arr[arr.length -1] == "docx") return (
                <Col span={lengText == 1? 24:lengText==2?12:8} className="text_file"> 
                  <FontAwesomeIcon icon="fa-solid fa-file" />
                  <a href={value} className="mess_file"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    download
                  >{arrName[arrName.length-1]}</a>
              </Col>
              )

              else if(arr[arr.length -1] == "mp4" )  return (
                <Col span={lengText == 1? 24:lengText==2?12:8}> 
                  <video width="320" height="240" controls style={{width:150, height:150}}>
                    <source src={value} type="video/mp4"/>
                  </video>
                </Col>
              )
              else  
              return (
                <Col span={lengText == 1? 24:lengText==2?12:8}> 
                  <img src={value} className="text_image"/>
                </Col>
                );
            })
          
          }
           {lastTextSeen && message.sender == AuthStore.user._id &&
            //  <div className="list_seen_messenger" hidden>
             
                <>
                {message.seens.map(value => {
                  if(value.id != AuthStore.user._id && value.seen)
                  return (
                    <img src={value.profilePicture} alt="" className="image_text"/>
                  )
                })}
              
                </>
             
          // </div>
             }
          {!seen && message.sender == AuthStore.user._id &&
            <>
            
            <img className="image_text" src="https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/13/000000/external-check-multimedia-kiranshastry-gradient-kiranshastry.png"/>
            
            </>
           } 
          {/* {console.log(text + " :" + isFile)} */}
        </Row>
       
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}) 

export default Message;
  

