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
import {Modal,Row,Col,Tooltip,  Form, Input, Button, Popover, Image} from 'antd'
import {countTextNotSeen, showMessageSuccess} from '../../helper/function'
import {CameraAlt} from '@material-ui/icons'
import { faBell, faChevronRight, faCog, faExclamation, faGamepad, faGem, faMoon, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add( fab, faExclamation, faCog, faQuestionCircle, faMoon, faSignOutAlt,faChevronRight,faFacebookMessenger,faGamepad,faBell) 
const header = observer((props) => {
    const AuthStore = useStore('AuthStore');
    const ActionStore = useStore('ActionStore');
    const {user} = AuthStore;
    const [visible, setVisible] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const countMess = countTextNotSeen(ActionStore.conversations, AuthStore.user?._id);
    const history = useHistory();
    const [listNotify, setListNotify] = useState([])
    const [modalProfile,setModalProfile] = useState(false);
    const [srcImage, setSrcImage] = useState(user.profilePicture ? user.profilePicture : PF + "person/noAvatar.png");
    const [hidden, setHidden] = useState(true);
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

      const handlePassMess = () => {
        history.push(`/messenger`)
      }

      useEffect(() => {
        if(!_.isEmpty(AuthStore?.socket)) {
          AuthStore?.socket.on('invite_to_group', ({name, user}) => {
            setListNotify(prev => [...prev,{profilePicture: user?.profilePicture, 
              des: `${user.username} đã mời bạn vào nhóm ${name}`, 
              created_at: moment(Date.now()).format("hh:mm DD-MM-YYYY")}]);
          })
    
          AuthStore?.socket.on("invite_success", ({username, profilePicture}) => {
              setListNotify(prev => [...prev,{profilePicture, 
                des: `${username} đã kết bạn với bạn`,
                created_at: moment(Date.now()).format("hh:mm DD-MM-YYYY"),
              }])
          })
        }

        AuthStore.socket?.on("delete_user", ({profilePicture, name, groupName, id}) => {
          setListNotify(prev => [...prev,{profilePicture, 
            des: `Quản trị viên đã xóa ${id == user?._id ? "bạn": name} ra khỏi nhóm ${groupName}`,
            created_at: moment(Date.now()).format("hh:mm DD-MM-YYYY"),
          }])
        })

        AuthStore.socket?.on("edit_tennhom", (data) => {
          setListNotify(prev => [...prev,{profilePicture: data.profilePicture, 
            des: data.des,
            created_at: moment(Date.now()).format("hh:mm DD-MM-YYYY"),
          }])
        })

        AuthStore.socket?.on("edit_bietdanh", (data) => {
          setListNotify(prev => [...prev,{profilePicture: data.profilePicture, 
            des: data.isGroup ? `${data.userChange} đã đổi biệt danh của ${data?.id == user?._id ? "bạn" : data.name } thành ${data?.newName} trong nhóm ${data?.nameGroup}` 
            : `${data.userChange} đã đổi biệt danh của ${data?.id == user?._id ? "bạn": "họ"} thành ${data?.newName} trong cuộc trò chuyện của hai người`,
            created_at: moment(Date.now()).format("hh:mm DD-MM-YYYY"),
          }])
        })
       
        AuthStore.socket?.on("leave_group", (data) => {
          setListNotify(prev => [...prev,{profilePicture: data.profilePicture, 
            des: data.des,
            created_at: moment(Date.now()).format("hh:mm DD-MM-YYYY"),
          }])
        })

      },[])
      //Modal Profile

      const showModalProfile = (visible) => {
        const handleOutProfile = () => {
          setModalProfile(false)
          setHidden(true)
        }

        const onFinish = async (urlBody) => {
          const result = await AuthStore.action_update_profile(urlBody);
          if(result) {
            AuthStore.action_editProfile("name", urlBody.username)
            showMessageSuccess("Cập nhật thành công !")
          } 
          setHidden(true)
        }

        const onChange = async file => {
           const src = await  AuthStore.action_uploadFileHeader({file: file.target.files[0],userId: AuthStore.user?._id})
          setSrcImage(src);
        };

        return (
          <Modal
                title="Thông tin cá nhân"
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
                <div class="title" style={{}}>{user.email}</div>
                <div class="actions">
                  <div class="follow-info">
                    <h2><a href="#"><span>{_.size(AuthStore.listFollow)}</span><small>Bạn Bè</small></a></h2>
                    {/* <h2><a href="#"><span>1000</span><small>Following</small></a></h2> */}
                  </div>
                  <div class="follow-btn">
                    <button>Thông tin cá nhân</button>
                  </div>
                </div>
                <div class="desc">
                      <Form
                          name="basic"
                          onFinish={onFinish}
                          autoComplete="off"
      
                        >
                          <Form.Item
                            label={<span style={{fontSize: '10px', fontWeight: 550}}>Tên</span>}
                            name="username"
                        
                            
                          >
                            <Input defaultValue={user?.username} disabled={hidden} style={{border: "none"}} />
                          </Form.Item>
                          

                          <Form.Item
                            label={<span style={{fontSize: '10px', fontWeight: 550}}>Mật khẩu hiện tại</span>}
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
                            label={<span style={{fontSize: '10px', fontWeight: 550}}>Mật khẩu mới</span>}
                            name="newpassword"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your new password!',
                              },
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
                              Sửa
                            </Button>
                            <Button  hidden={hidden} style={{borderRadius: '10px', border: "none", background: '#ffd01a', color: 'black', marginLeft: '12px'}} onClick={() => {
                              setHidden(true);
                            }}>Huỷ</Button>
                          </Form.Item>
                        </Form>

                </div>
              </div>

               
            </Modal>
   
        )
      }
     const renderNotify = () => {
       return (
          <Row style={{width: '311px', height: '270px', overflowY: 'scroll'}}>
              
                      <Col span={24} style={{height: '45px'}}>
                      {sortNotify(listNotify).map(value => {
                        return (
                          <Row justify="space-between" align="middle" style={{boxShadow: "rgb(0 0 0 / 15%) 1.95px 1.95px 2.6px", border: '1px solid #e0d8d8'}}>
                              <Col span={3} >
                                  <Image src={value.profilePicture} preview={false} style={{borderRadius: '50%'}}/>
                              </Col>
                              <Col span={20}> 
                                  <Row>
                                      <Col span={24} style={{fontSize: '13px', fontWeight: '550'}}>
                                        {value.des}
                                      </Col>
                                      <Col span={24} style={{fontSize: '13px', fontWeight: '550', color: 'gray'}}>
                                        {value.created_at}
                                      </Col>
                                  </Row>
                              </Col>
                          </Row>
                     
                  )
              })}
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
                      <Tooltip title="Thông tin cá nhân" placement="rightTop"> 
                        <img src={srcImage}  />
                      </Tooltip>
                    </Col>
                    <Col span={24} className="sideBar-conversation sideBar-active-class" onClick={handlePassMess}>
                        <FontAwesomeIcon icon={faFacebookMessenger} />
                        {countMess != 0 && <span>{countMess} </span> }
                    </Col>

                    <Col span={24} className="sideBar-game">
                        <FontAwesomeIcon icon={faGamepad} />
                    </Col>
                    <Col span={24} className="sideBar-Notify" onClick={() => {
                      
                    }}>
                        <Popover placement="right" title={<b>Thông báo</b>} 
                          trigger="click" 
                          style={{background: 'transparent', padding: '13px'}}
                          content={renderNotify}
                        >
                          <FontAwesomeIcon icon={faBell} />
                          {_.size(listNotify) != 0 && <span className="count-noti">{_.size(listNotify)}</span> }
                        </Popover>
                        
                        
                    </Col>
                    <Col span={24} className="sideBar-logOut" onClick={showModal}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    </Col>
                    
                </Row>
            </div>
        
            <Modal
                title="Bạn có chắc muốn thoát!"
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