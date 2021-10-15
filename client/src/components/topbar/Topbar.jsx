import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import {observer} from 'mobx-react-lite'
import {useStore} from '../../hook'
import Header from '../header/Header'
import {showMessageError,countTextNotSeen} from '../../helper/function'
import { Modal, Button, Space } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash'
const Topbar = observer(() =>{
  // const { user } = useContext(AuthContext);
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');
  const {user} = AuthStore;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = countTextNotSeen(ActionStore.conversations, AuthStore.user?._id);

  const handleSetting = async (e) => {
    const element = ref.current.getAttribute("class");
    if(element.indexOf("hidden") != -1) {
      ref.current.classList.remove("hidden");
    } else ref.current.classList.add("hidden");
    
  }

  const showModal = () => {
    setVisible(true); 
  }

  const handleLogout = async () => {
    !_.isEmpty(AuthStore.socket) && AuthStore.socket.emit("userOffline", AuthStore.user._id);
    
    await AuthStore.action_logout();
    setVisible(false); 
  }

  const handleCancel = () => {
    setVisible(false); 
  }
  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <>
    <div className="topbarContainer">
      <Header/>
      {/* <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">CHATTING</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarProfile">
          <Link to={`/profile/${user?._id}`}>
              <img
                src={
                  user?.profilePicture
                    ?user?.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="topbarImg"
              />
              <span>{user.username}</span>
            </Link>
            
        </div>
        
       
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <img src="https://img.icons8.com/ios/25 /000000/user--v1.png" />

          </div>
          <div className="topbarIconItem">
            <Link to="/messenger"><img src="https://img.icons8.com/ios/25/000000/facebook-messenger--v1.png"/></Link> 
            {count != 0 && 
              <>
                 <span className="topbarIconBadge">{count}</span>
              </>
            }
           
          </div>
          <div className="topbarIconItem">

            <img src="https://img.icons8.com/material-outlined/25/000000/filled-appointment-reminders.png"/>

          </div>
          <div className="topbarIconItem topbarExitMain" onClick={handleSetting}>

            <img src="https://img.icons8.com/ios-glyphs/25/000000/circled-chevron-down.png"/>
            <div className="topbarExit" ref={ref}>
                <ul>
                  <li className="topbarExit_list-profile">
                      <Link to={`/profile/${user?._id}`}>
                        <img
                          src={
                            user?.profilePicture
                              ?user?.profilePicture
                              : PF + "person/noAvatar.png"
                          }
                          alt=""
                          className="topbarImg topbarImgExit"
                        />
                        <div>
                          <span>{user.username}</span>  
                          <p>Xem trang cá nhân của bản</p>  
                        </div>
                        
                     </Link>
                  </li>
                  <li className="topbarBorder">
                    <img src="https://img.icons8.com/external-flatart-icons-solid-flatarticons/45/000000/external-error-message-chat-flatart-icons-solid-flatarticons.png"/>
                    <span>Đóng góp ý kiến</span> 
                  </li>
                  <li>
                    <img src="https://img.icons8.com/dotty/30/000000/user.png"/>
                   
                    <span>Chuyển tài khoản</span>  
                  </li>
                  <li>
                    <img src="https://img.icons8.com/ios-glyphs/30/000000/settings--v1.png"/>
                    <span>{`Cài đặt & quyền riêng tư`}</span>  
                  </li>
                  <li>
                    <img src="https://img.icons8.com/material-sharp/30/000000/help.png"/>
                    <span>{`Trợ giúp & hỗ trợ`}</span>  
                  </li>
                  <li>
                    <img src="https://img.icons8.com/ios-glyphs/30/000000/moon-symbol.png"/>

                    <span>{`Màn hình & trợ năng`}</span>  
                    </li>
                  <li onClick={showModal}>
                    <img src="https://img.icons8.com/material-outlined/30/000000/exit.png"/>
                    <span>Đăng xuất</span>      
                  </li>
                </ul>
            </div>

          </div>

          
        </div>
      </div> */}
    </div>

      <Modal
      title="Bạn có chắc muốn thoát!"
      visible={visible}
      onOk={handleLogout}
      // confirmLoading={confirmLoading}
      onCancel={handleCancel}
      >
      </Modal>
      </>
  );
}) 
  
export default Topbar;

