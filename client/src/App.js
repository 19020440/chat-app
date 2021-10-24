
import Login from "./pages/login/Login";

import Register from "./pages/register/Register";
import { Modal } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  
} from "react-router-dom";
import {  useEffect, useLayoutEffect, useRef, useState } from "react";

import {observer} from 'mobx-react-lite'
import {useStore} from './hook'
import Loading from "./components/Loading/Loading";
import PrRouter from "./pages/PrRouter";

import _ from 'lodash';
import io from 'socket.io-client';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee,faBell, faEllipsisH, faCaretDown, faSun, faMoon, faPhone,faInfoCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import CallVideo from "./components/CallVideo/CallVideo";
import Camera from "./components/camera/Camera";
library.add( fab,faCheckSquare, faCoffee,faBell, faEllipsisH,faCaretDown,faSun,faMoon,faPhone,faInfoCircle,faPlusCircle) 
const socket = io.connect("http://localhost:8800");
const App = observer(() => {
  const [visible, setVisible] = useState(false);
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');
  const {user, login} = AuthStore;
  const from = useRef();
  const [userCall, setUserCall] = useState();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const signal = useRef();
  useLayoutEffect(() => {
    AuthStore.action_setSocket(socket)
    validLogin();
  },[]) 

  useEffect(() => {
    socket.on("connect", () => {
      AuthStore.action_setCallVideoSocketId(socket.id)
    });
  },[]);
  useEffect(() => {
    AuthStore.socket?.on("setUserOffline", (userId) => {

     ActionStore.action_setOfflientStatus();
    })
    AuthStore.socket?.on("setOnline", (data) => {
     ActionStore.action_setOfflientStatus();
    })

    AuthStore.socket?.on("setJoin_room", (conversationId) => {
      ActionStore.action_updateStatusSeenConversation(conversationId, "join");
      AuthStore.action_setSatusSeenText();
    })

    AuthStore.socket?.on("setout_room", (conversationId) => {
      ActionStore.action_updateStatusSeenConversation(conversationId, "out")
    })

    AuthStore.socket?.on("getMessage", (data) => {

     ActionStore.action_updateConnversationById({
       updatedAt:Date(data.updatedAt),
       lastText: {
         sender: data.senderId,
         text: data.text,
         seens: data.seens,
       }
     }, data.conversationId);
    })

    AuthStore.socket?.on('callUser', async (data) => {
      from.current = data.roomID;
      setUserCall(data.from)
      setVisible(true);
    })
   
 },[]);

  const validLogin = async () => {
    if(window.location.pathname != '/callvideo') {
      const token = await sessionStorage.getItem('token');
      !token && AuthStore.action_setLogin(0);
      token && await AuthStore.action_valdLogin();
    } else {
      const token = await sessionStorage.getItem('token');
      token && await sessionStorage.removeItem('token');
    }
  }

   // accept call
   const handleOk = async () => {
    setVisible(false);
    window.open(`http://localhost:3000/callvideo?from=${userCall?._id}&room=${from.current}&status=1`, "_blank")
    
  }

 // tu choi call video
 const handleCancel = () => {
  setVisible(false);
   
 }
  return (
    <>
    <Router>
      <Switch>
        {/* <Route exact path="/">
          {login ? <Home /> : <Register />}
        </Route>
        <Route path="/login">{login ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {login ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/messenger">
          {!login ? <Redirect to="/" /> : <Messenger />}
        </Route>
        <Route path="/profile/:_id">
          <Profile />
        </Route> */}

        <Route path="/login">{login == 1 ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {login == 1 ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/callvideo" component={CallVideo} exact/>
        <Route path="/camera" component={Camera} exact/>
        <ProtectedRoute 
          path="/"
          component={PrRouter}
          login={login}
          />

      </Switch>
    </Router>

            <Modal
                title="Call Video"
                visible={visible}
                onOk={handleOk}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Trả lời"
                cancelText="Từ chối"
            >
              <img src={
                userCall?.profilePicture
                    ? userCall?.profilePicture
                    : PF + "person/noAvatar.png"
                } alt="" className="header-profile__img avt" />

                <span>{userCall?.username}</span>

          </Modal>
          </>
  );

})
  
const ProtectedRoute = ({login, component: Component,...rest}) => {
  return (
    <Route {...rest} render={(props) => {
      if(login == 2) return <Loading isLoading={true} />
      else if(login == 1) return <Component />
      else return <Redirect  to={{
        pathname: '/login',
        state: { from: props.location },
      }} />
    }}
    />
  );
}

export default App;
