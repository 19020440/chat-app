import "./message.css";
import { format } from "timeago.js";
import {useStore} from '../../hook'
import { useEffect, useState } from "react";
import {observer} from 'mobx-react-lite'
import _ from "lodash";
import {searchSendMess, findIndexFromArrayLodash} from '../../helper/function'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faFile, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Row,Col, Popover, Modal, Avatar, Image, Button, Input, Form, message  } from "antd";
import {MoreHoriz, PriorityHigh} from '@material-ui/icons'
library.add(fab,faFile, faSearch)

const  Message = observer(({ message, own,seen,lastTextSeen, onChangeMess, statusMess, onChangAllMess, currentCov}) => {
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [isText, setIsText] = useState(false);
  const [isFile,setIsFile] = useState(false);
  const profileFriends = message.seens.filter(value => value.id == message.sender)
  const [profileFriend, setProfileFriend] = useState({});
  const lengText = _.size(JSON.parse(message.text));
  const text = JSON.parse(message.text)
  const [deleteText, setDeleteText] = useState(false);
  const [sendText, setSendText] = useState(false);
  const [form] = Form.useForm();
  const {Search} = Input;
  const [listSend, setListSend] = useState([]);
  console.log( ActionStore.listSendText);
//Modal chuyen tie tin nhan
const modalSendText = (status) => {
  const handleCancelGroup = () => {
    setSendText(false);
  }
  const handleSend = () => {

  }
  
  return (
    <Modal  visible={status}  onCancel={handleCancelGroup} className="modal-group" 
        onOk={handleSend}
        cancelText="Huỷ"
        okText="Gửi"
        footer={false}
        title="Gửi cho nhiều người"
      >
        <div >
            <Form 
            form={form}
            >
                <Form.Item> 
                  <Search  placeholder="Tìm kiếm" allowClear onChange={(e) => {
                    // searchSendMess(listSend)
                    setListSend(searchSendMess(ActionStore.listSendMess, e.target.value))
                  }}/>
                </Form.Item>
               
            </Form>
            <span style={{fontSize: '18px', fontWeight: '550'}}>Bạn bè</span>
            <Row style={{overflowY: 'scroll', maxHeight: '350px'}}>
                {!_.isEmpty(listSend) && listSend.map(value => {
                  if(value && value?.id != currentCov) return (
                      <Col span={24} style={{padding: '8px', borderBottom: '1px solid #eee3e3'}}>
                        <Row align="middle">
                          <Col span={3} >
                            <Image src={value?.profilePicture ? value?.profilePicture : 'https://nld.mediacdn.vn/2021/1/5/d9db633fe9c98429ec9025ca0950f241-16098228091571816318835.jpg'} preview={false} style={{borderRadius: '50%', width: '40px', height: '40px'}}/>
                          </Col>
                          <Col span={12}>
                            {value?.username}
                          </Col>
                          <Col span={3} style={{marginLeft: 'auto'}}>
                            {value?.dagui ? 
                              <Button> 
                                Đã gửi
                              </Button>
                            :
                            <Button onClick={async () => {
                                const messages = {
                                sender: AuthStore?.user._id,
                                text: message.text,
                                conversationId: value?.id,
                                seens: value?.members,
                                seen: !_.isEmpty(seen),
                              };
                              const res = await ActionStore.action_saveMessage(messages);
                              if(res) {
                                const {conversationId,...lastText} = messages;
                                const index = findIndexFromArrayLodash(ActionStore.conversations, {_id: value?.id})
                                ActionStore.action_setConverSationByIndex({updatedAt: Date(Date.now()),lastText}, index);
                                AuthStore.socket?.emit("sendMessage", res);
                                setListSend([...listSend].map(items => {
                                  if(items?.id == value?.id) value.dagui = true;
                                  return items;
                                }))
                              }
                             
                              
                              }}>Gửi</Button>
                            }
                              
                          </Col>
                        </Row>
                      </Col>
                     )
                })}
            </Row>
            
        </div>
      </Modal>
    )
}


  //Modal go tin nhan
  const modalAsk = (status) => {
    return (
    <Modal title={<Avatar icon={<PriorityHigh style={{color: 'white'}}/>}></Avatar>} visible={status} 
    okText="Đồng ý"
    cancelText="Hủy"
    onOk={async  () => {
      const result = await ActionStore.action_gotinnhan(message?._id)
      if(result) {
        message.go = true;
        onChangeMess(!statusMess);
        AuthStore?.socket.emit("gotinnhan", {messId: message?._id, covId: currentCov})
        setDeleteText(false)
        
      }
    }}
    onCancel={() => setDeleteText(false)}

    > 
      <b>Bạn có chắc muốn gỡ tin nhắn?</b>
    </Modal>
    )
  }
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
        <Popover content={ own && !message.go ?
          <Popover placement="bottom" style={{padding: '0'}}  content={
            <Row>
              <Col span={24} className="attribute_text" onClick={(e) => {
                setDeleteText(true)
              }}>
                  Gỡ
              </Col>
              <Col span={24} className="attribute_text" onClick={() => {
                setSendText(true)
                setListSend(ActionStore.listSendMess)
              }}>
                Chuyển tiếp
              </Col>
            </Row>
          } > 
            <MoreHoriz/>
          </Popover> : <>...</>
        }  placement={own ? "right": "left"}> 
        <Row className="massafeTextAndSeen">
          {message?.go ? <p className="messageText">Tin nhắn đã bị gỡ</p> :
          isText ? <p className="messageText">{JSON.parse(message.text)}</p> :
           isFile ?
            text.map((value) => {
              const arr = value.split('.');
              const arrName = value.split('_');
             
              if(arr[arr.length -1] == "pdf" || arr[arr.length -1] == "docx") return (
                <Col span={lengText == 1? 24:lengText==2?12:8} className="text_file"> 
                  <FontAwesomeIcon icon="fa-solid fa-file" />
                  <a href={value} className="mess_file"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(e.target.href);
                    }}
                    download="filename"
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
            }) : <></>
          }

           {lastTextSeen && message.sender == AuthStore.user._id &&
                <div style={{position: 'absolute', bottom: '-15px',right: '-10px'}}>
                {message.seens.map(value => {
                  if(value.id != AuthStore.user._id && value.seen)
                  return (
                    <img src={value.profilePicture} alt="" className="image_text"/>
                  )
                })}
                </div>
             }
          {!seen && message.sender == AuthStore.user._id &&
            <>
            <img className="image_text_notseen" src="https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/15/000000/external-check-multimedia-kiranshastry-lineal-color-kiranshastry.png"/>
            </> 
           } 
        </Row>
        </Popover>
        
       
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
      {deleteText && modalAsk(deleteText)}
      { sendText && modalSendText(sendText)}
    </div>
  );
}) 

export default Message;
  

