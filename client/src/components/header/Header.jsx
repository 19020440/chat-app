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
import {Modal,Row,Col} from 'antd'
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
    const handleTheme = async () => {
        
        await AuthStore.action_setTheme();
    }
    const handleLogOut = async () => {
        !_.isEmpty(AuthStore.socket) && AuthStore.socket.emit("userOffline", {userId: AuthStore.user._id, arrCov: ActionStore.conversations});
        
        await AuthStore.action_logout();
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
      
     
    return (
        <>
            <div className="sideBar-chat">
                <Row>
                    <Col span={24} className="sideBar-info-img" onClick={handlePassProfile}>
                        <img src={user.profilePicture}  />
                    </Col>
                    <Col span={24} className="sideBar-conversation sideBar-active-class" onClick={handlePassMess}>
                        <FontAwesomeIcon icon={faFacebookMessenger} />
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
            </>
    );
});

export default header;