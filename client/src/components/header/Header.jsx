import React, {useState, useRef} from 'react';
import './header.css'
import {useHistory} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {observer} from 'mobx-react-lite'
import {useStore} from '../../hook'
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import _ from 'lodash'
import {Modal,Row,Col,Tooltip} from 'antd'
import {countTextNotSeen} from '../../helper/function'
import { faBell, faChevronRight, faCog, faExclamation, faGamepad, faGem, faMoon, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add( fab, faExclamation, faCog, faQuestionCircle, faMoon, faSignOutAlt,faChevronRight,faFacebookMessenger,faGamepad,faBell) 
const header = observer((props) => {
    const AuthStore = useStore('AuthStore');
    const ActionStore = useStore('ActionStore');
    const {user} = AuthStore;
    const [visible, setVisible] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const ref = useRef(null);
    const countMess = countTextNotSeen(ActionStore.conversations, AuthStore.user?._id);
    const history = useHistory();
    const notifyRef = useRef(null);
    const [modalProfile,setModalProfile] = useState(false);
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

      const handleSetting = async (e) => {
        const element = ref.current.getAttribute("class");
        if(element.indexOf("hidden") != -1) {
          ref.current.classList.remove("hidden");
        } else ref.current.classList.add("hidden");
        
      }
    
      //pass page
      const handlePassProfile = (e) => {
          history.push(`/profile/${AuthStore.user?._id}`)
      }
      const handlePassMess = () => {
        history.push(`/messenger`)
      }
      //Modal Profile

      const showModalProfile = (visible) => {
        const handleOutProfile = () => {
          setModalProfile(false)
        }
        return (
          <Modal
                title="Thông tin cá nhân"
                visible={visible}
                // confirmLoading={confirmLoading}
                onCancel={handleOutProfile}
                className="modal_profile"
                >
                  
              <div class="card">
                <div class="banner">
                 
                   <img src={user.profilePicture} alt="" />
                
                  
                </div>
                <div class="menu">
                  <div class="opener"><span></span><span></span><span></span></div>
                </div>
                <h2 class="name">{user.username}</h2>
                <div class="title">{user.email}</div>
                <div class="actions">
                  <div class="follow-info">
                    <h2><a href="#"><span>12</span><small>Followers</small></a></h2>
                    <h2><a href="#"><span>1000</span><small>Following</small></a></h2>
                  </div>
                  <div class="follow-btn">
                    <button>Follow</button>
                  </div>
                </div>
                <div class="desc">Morgan has collected ants since they were six years old and now has many dozen ants but none in their pants.</div>
              </div>

               
            </Modal>
   
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
                        <img src={user.profilePicture}  />
                      </Tooltip>
                    </Col>
                    <Col span={24} className="sideBar-conversation sideBar-active-class" onClick={handlePassMess}>
                        <FontAwesomeIcon icon={faFacebookMessenger} />
                        {console.log(countMess)}
                        {countMess != 0 && <span>{countMess} </span> }
                    </Col>

                    <Col span={24} className="sideBar-game">
                        <FontAwesomeIcon icon={faGamepad} />
                    </Col>
                    <Col span={24} className="sideBar-Notify">
                        <FontAwesomeIcon icon={faBell} />
                        
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