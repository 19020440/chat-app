import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import {findIndexLastTextSeen,sortConversationByUpdateAt} from '../../helper/function'
import { useContext, useEffect, useRef, useState } from "react";
import { Switch, Route,Link, useParams} from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash';
import Search from '../../components/searchFriend/search'
import ChatBox from '../../components/ChatBox/Chat'
import ChatEmpty from "../../components/ChatEmpty/ChatEmpty";
import Headers from '../../components/header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faAirFreshener, faGift, faInfoCircle, faPhone, faPlusCircle, faPortrait,faArrowAltCircleRight,faThumbsUp} from '@fortawesome/free-solid-svg-icons'
import ContrainerMess from "../../components/ContainerMess/ContrainerMess";
import { Row, Col,Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

library.add(fab,faPhone,faInfoCircle,faPlusCircle,faPortrait,faAirFreshener,faGift,faArrowAltCircleRight,faThumbsUp) 

const Messenger = observer(() => {
  const AuthStore = useStore('AuthStore');
  useEffect(() => {
    AuthStore.action_getGifPhyList("");
  },[])
  return (

    <Layout className={`app${AuthStore.themePage?"": " dark"}`}>
      <Sider><Headers /></Sider>
        <Layout className="app-grid">
          <Header>{`Social App-${AuthStore.user?.username}`}</Header>
          <Content> 
            <Row className="container" gutter={0}>
                
                <Col span={6}>
                  <Conversation />
                </Col>
                <Col span={18} className="container_chat_main"> 
                  <Switch>
                    <Route path="/messenger" exact component={ChatEmpty}/>
                    <Route path="/messenger/:conversationId" exact component={ContrainerMess}/>
                  </ Switch>
                </Col>
                
            </Row></Content>
           
        </Layout>
    </Layout>



  );
}) 

export default Messenger;
  
