import React, {useState, useRef, useEffect} from 'react';
import './header.css'
import moment from 'moment'
import {useHistory} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {observer} from 'mobx-react-lite'
import {useStore} from '../../hook'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import _ from 'lodash'
import {sortNotify} from '../../helper/function'
import {Modal,Row,Col,Tooltip,  Form, Input, Button, Popover, Image, message} from 'antd'
import {countTextNotSeen, showMessageSuccess} from '../../helper/function'
import {CameraAlt} from '@material-ui/icons'
import { faBell, faChevronRight, faCog, faExclamation, faGamepad, faGem, faMoon, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add( fab, faExclamation, faCog, faQuestionCircle, faMoon, faSignOutAlt,faChevronRight,faFacebookMessenger,faGamepad,faBell) 
const header = observer((props) => {
    const AuthStore = useStore('AuthStore');
    const ActionStore = useStore('ActionStore');
    const {user} = AuthStore;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const countMess = countTextNotSeen(ActionStore.conversations, AuthStore.user?._id);
    const history = useHistory();
    const [listNotify, setListNotify] = useState([])
    const [modalProfile,setModalProfile] = useState(false);
    const [srcImage, setSrcImage] = useState(user.profilePicture ? user.profilePicture : PF + "person/noAvatar.png");
    const [hidden, setHidden] = useState(true);
    const [statusBackGr, setStatusBackGr] = useState(1);
    const handleLogOut = async () => {
        !_.isEmpty(AuthStore.socket) && AuthStore.socket.emit("userOffline", {userId: AuthStore.user._id, arrCov: ActionStore.conversations});
        
        await AuthStore.action_logout();
        ActionStore.action_resetAllData();
        setVisible(false); 
      }
    
      const handleCancel = () => {
        setVisible(false); 
      }

      const showModal = () => {
        setVisible(true); 
      }

      //lay danh saach thong bao
      useEffect(() => {
        setListNotify(ActionStore.listNotify)
      }, [ActionStore.listNotify])

      const handlePassMess = () => {
        AuthStore.action_setShowGame(false);
        setStatusBackGr(1);
        history.push(`/messenger`)
      }

      useEffect(() => {
        if(!_.isEmpty(AuthStore?.socket)) {
          AuthStore?.socket.on('invite_to_group', async (result) => {
                setListNotify(prev => [...prev,result]);
          })
    
          AuthStore?.socket.on("invite_success", (data) => {
            console.log(data);
              setListNotify(prev => [...prev, data])
          })
        }


        AuthStore.socket?.on("add_member_cov", (data) => {
          console.log("addasdasd", data);
          setListNotify(prev => [...prev, data])
        })

        AuthStore.socket?.on("delete_user", async (data) => {
            data.map(item => {
              if(item?.value?.userId == AuthStore?.user?._id) {
                setListNotify(prev => [...prev, item?.value]);
              }
            })
        })

        AuthStore.socket?.on("edit_tennhom", (data) => {
          console.log(data);
          data.map(item => {
            if(item?.value?.userId == AuthStore?.user?._id) {
              setListNotify(prev => [...prev, item?.value]);
            }
          })


          // setListNotify(prev => [...prev,{profilePicture: data.profilePicture, 
          //   des: data.des,
          //   createdAt: moment(Date.now()).format("hh:mm DD-MM-YYYY"),
          // }])
        })

        AuthStore.socket?.on("edit_bietdanh", (data) => {
          setListNotify(prev => [...prev,{profilePicture: data.profilePicture, 
            des: data.isGroup ? `${data.userChange} ???? ?????i bi???t danh c???a ${data?.id == user?._id ? "b???n" : data.name } th??nh ${data?.newName} trong nh??m ${data?.nameGroup}` 
            : `${data.userChange} ???? ?????i bi???t danh c???a ${data?.id == user?._id ? "b???n": "h???"} th??nh ${data?.newName} trong cu???c tr?? chuy???n c???a hai ng?????i`,
            createdAt: moment(Date.now()).format("hh:mm DD-MM-YYYY"),
          }])
        })
       
        AuthStore.socket?.on("leave_group", (data) => {
          data.map(item => {
            if(item?.value?.userId == AuthStore?.user?._id) {
              setListNotify(prev => [...prev, item?.value]);
            }
          })
        })

        //tu choi tra loi 
      AuthStore.socket.on("end_call", data => {
        setListNotify(prev => [...prev, data])
      })

      },[])
      //Modal Profile

      const showModalProfile = (visible) => {
        const handleOutProfile = () => {
          setModalProfile(false)
          setHidden(true)
        }

        const onFinish = async (urlBody) => {
          if(!urlBody.username) urlBody.username = user?.username;
          const result = await AuthStore.action_update_profile(urlBody);
          if(result) {
            AuthStore.action_editProfile("name", urlBody.username)
            form.setFieldsValue({"newpassword": ""})
            form.setFieldsValue({"password": urlBody.newpassword})
            setHidden(true)
            showMessageSuccess("C???p nh???t th??nh c??ng !")
          } 
          
        }

        const onChange = async file => {
           const src = await  AuthStore.action_uploadFileHeader({file: file.target.files[0],userId: AuthStore.user?._id, arrCov: AuthStore?.listRoom})
          if(src) {
            AuthStore?.listRoom.forEach(async item => {
              const result = await ActionStore.action_callApiUploadImageCov({covId: item, src,userId: AuthStore.user?._id});
              if (result) AuthStore.socket.emit("upload_image", {covId: item, src, userId: AuthStore.user?._id})
            });
            
            setSrcImage(src);
          }
        };

        return (
          <Modal
                title="Th??ng tin c?? nh??n"
                visible={visible}
                onCancel={handleOutProfile}
                className="modal_profile"
                >
                  
              <div class="card">
                <div class="banner" style={{position: 'relative'}}>
                 
                   <img src={srcImage} alt="" />
                    <div hidden>
                      <input 
                      onChange={onChange}
                      type="file"
                      id="upload_header"
                    /> 
                    </div>
                    <label style={{position: 'absolute', bottom: '-37%',right: '42%',zIndex: 10}} for="upload_header" > 
                      <CameraAlt  />  
                    </label>

                </div>
                <div class="menu">
                  <div class="opener"><span></span><span></span><span></span></div>
                </div>
                <h2 class="name">{user.username}</h2>
                <div class="title" >{user.email}</div>
                <div class="actions">
                  <div class="follow-info">
                    <h2><a href="#"><span>{_.size(AuthStore.listFollow)}</span><small>B???n B??</small></a></h2>
                    {/* <h2><a href="#"><span>1000</span><small>Following</small></a></h2> */}
                  </div>
                  <div class="follow-btn">
                    <button>Th??ng tin c?? nh??n</button>
                  </div>
                </div>
                <div class="desc">
                      <Form
                          name="basic"
                          onFinish={onFinish}
                          form={form}
                        >
                          <Form.Item
                            label={<span style={{fontSize: '10px', fontWeight: 550}}>T??n</span>}
                            name="username"
                        
                            
                          >
                            <Input defaultValue={user?.username} value={user?.username} disabled={hidden} style={{border: "none"}} />
                          </Form.Item>
                          

                          <Form.Item
                            label={<span style={{fontSize: '10px', fontWeight: 550}}>M???t kh???u hi???n t???i</span>}
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your password!',
                              },
                            ]}
                         
                          >
                            <Input.Password disabled={hidden} style={{border: "none"}} defaultValue={hidden ? "*****" : ""}/>
                          </Form.Item>

                          <Form.Item
                            label={<span style={{fontSize: '10px', fontWeight: 550}}>M???t kh???u m???i</span>}
                            name="newpassword"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your new password!',
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if ( value == form.getFieldValue('password')) {
                                    
                                      return Promise.reject("M???t kh???u m???i ph???i kh??c m???t kh???u hi???n t???i");
                                    
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            hidden={hidden}
                          >
                            <Input.Password />
                          </Form.Item>

                          <Form.Item
                            wrapperCol={{
                              offset: hidden ? 18 : 12,
                              span: hidden ? 6 : 12,
                            }}
                          >
                            <Button type="primary" htmlType="submit" hidden hidden={hidden} style={{borderRadius: '10px', border: "none", background: '#ffd01a', color: 'black'}}>
                              Submit
                            </Button>
                            <Button hidden={!hidden} style={{borderRadius: '10px', border: "none", background: '#ffd01a', color: 'black'}} onClick={() => {
                              setHidden(false);
                            }}>
                              S???a
                            </Button>
                            <Button  hidden={hidden} style={{borderRadius: '10px', border: "none", background: '#ffd01a', color: 'black', marginLeft: '12px'}} onClick={() => {
                              setHidden(true);
                            }}>Hu???</Button>
                          </Form.Item>
                        </Form>

                </div>
              </div>

               
            </Modal>
   
        )
      }
     const renderNotify = () => {
       return (
          <Row style={{width: '311px', height: '270px', overflowY: 'scroll', position: 'relative', minHeight: '70px'}}>
              
                      <Col span={24} style={{height: '90%', overflowY: 'scroll'}}>
                      {sortNotify(listNotify).map(value => {
                        return (
                          <Row justify="space-between" align="middle" style={{boxShadow: "rgb(0 0 0 / 15%) 1.95px 1.95px 2.6px", border: '1px solid #e0d8d8'}}
                            className={value?.seen ? 'notify_seened' : ''}
                            onClick={async() => {
                              const result = await ActionStore.action_updateSeenNotify(value?._id);
                              if(result) {
                                value.seen = true;
                                setListNotify([...listNotify]);
                              }
                            }} 
                          >
                              <Col span={3} >
                                  <Image src={value.profilePicture} preview={false} style={{borderRadius: '50%'}}/>
                              </Col>
                              <Col span={20}> 
                                  <Row>
                                      <Col span={24} style={{fontSize: '13px', fontWeight: '550'}}>
                                        {value.des}
                                      </Col>
                                      <Col span={24} style={{fontSize: '13px', fontWeight: '550', color: 'gray'}}>
                                        {moment(value.createdAt).format("hh:mm DD-MM-YYYY")}
                                      </Col>
                                  </Row>
                              </Col>
                          </Row>
                     
                  )
              })}
               </Col>

               <Col span={24} style={{position: 'absolute', bottom: 0, right: 0, left: 0, textAlign: 'center', background: 'white', borderTop: '1px solid #d8c8c8', height: '10%', cursor: 'pointer'}}
                onClick={async () => {
                  if(_.isEmpty(listNotify)) {
                    message.info("L??m g?? c?? g?? m?? x??a ?")
                  } else {
                    const result = await AuthStore.action_deleteAllNotify(AuthStore?.user?._id);
                    if(result) {
                      message.success("Xo?? h???t lu??n r???i :)");
                      setListNotify([])
                    }
                  }
                  
                }}
               >
                  <span>X??a t???t c??? th??ng b??o</span>
               </Col>
          </Row>
       )
     }
    return (
        <>
            <div className="sideBar-chat">
                <Row>
                    <Col span={24} className="sideBar-info-img" onClick={() => {
                      setModalProfile(true);
                    }}>
                      <Tooltip title="Th??ng tin c?? nh??n" placement="rightTop"> 
                        <img src={srcImage}  />
                      </Tooltip>
                    </Col>
                    <Col span={24} className={`sideBar-conversation ${statusBackGr == 1 ? "sideBar-active-class" : ""}`} onClick={handlePassMess}>
                        <FontAwesomeIcon icon={faFacebookMessenger} />
                        {countMess != 0 && <span>{countMess} </span> }
                    </Col>

                    <Col span={24} className={`sideBar-game ${statusBackGr == 2 ? "sideBar-active-class" : ""}`} onClick={(e) => {
                      setStatusBackGr(2);
                      AuthStore.action_setShowGame(true);
                    }}>
                        <FontAwesomeIcon icon={faGamepad} />
                    </Col>
                    <Col span={24} className={`sideBar-Notify ${statusBackGr == 3 ? "sideBar-active-class" : ""}`} onClick={() => {
                      
                    }}>
                        <Popover placement="right" title={<b>Th??ng b??o</b>} 
                          trigger="click" 
                          style={{background: 'transparent', padding: '13px'}}
                          content={renderNotify}
                        >
                          <FontAwesomeIcon icon={faBell} />
                          {_.size(listNotify) != 0 && <span className="count-noti">{_.size(listNotify.filter(items => !items.seen))}</span> }
                        </Popover>
                        
                        
                    </Col>
                    <Col span={24} className="sideBar-logOut" onClick={showModal}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    </Col>
                    
                </Row>
            </div>
        
            <Modal
                title="B???n c?? ch???c mu???n tho??t!"
                visible={visible}
                onOk={handleLogOut}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
                >
            </Modal>
            {showModalProfile(modalProfile)}
            </>
           
    );
});

export default header;