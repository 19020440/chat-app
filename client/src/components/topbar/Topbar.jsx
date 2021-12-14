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

