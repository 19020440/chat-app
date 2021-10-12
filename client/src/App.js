
import Login from "./pages/login/Login";

import Register from "./pages/register/Register";
import {Modal} from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";

import {observer} from 'mobx-react-lite'
import {useStore} from './hook'
import Loading from "./components/Loading/Loading";
import PrRouter from "./pages/PrRouter";

import _ from 'lodash';
import io from 'socket.io-client';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee,faBell, faEllipsisH, faCaretDown, faSun, faMoon, faPhone,faInfoCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
library.add( fab,faCheckSquare, faCoffee,faBell, faEllipsisH,faCaretDown,faSun,faMoon,faPhone,faInfoCircle,faPlusCircle) 
const socket = io.connect("http://localhost:8800");
const App = observer(() => {
  // const { user } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');
  const {user, login} = AuthStore;
  const [userCall, setUserCall] = useState();
  // const location = useLocation();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  

  useLayoutEffect(() => {
    AuthStore.action_setSocket(socket)
    validLogin();
  },[]) 

  // useEffect(() => {
  //  console.log(location);
  // },[]);
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
      console.log("this is text: ", data.text);
     ActionStore.action_updateConnversationById({
       updatedAt:Date(data.updatedAt),
       lastText: {
         sender: data.senderId,
         text: data.text,
         seens: data.seens,
       }
     }, data.conversationId);
    })

    ActionStore.socket?.on('callUser', async (data) => {
      console.log(data);
      setUserCall(data.from)
      setVisible(true);
    })
   
 },[]);

  const validLogin = async () => {
    
    const token = await sessionStorage.getItem('token');
    !token && AuthStore.action_setLogin(0);
    token && await AuthStore.action_valdLogin();
    
  }
  // accept call
  const handleOk = async () => {
     window.open(`http://localhost:3000/callvideo?from=${user._id}&to=${ActionStore.profileOfFriend?._id}&status=1`, "_blank")
  }

  // tu choi call video
  const handleCancel = () => {
    AuthStore.action_setCallStatus("cancel");
  }
  return (
    <>
      <Router>
        <Switch>
          <Route path="/login">{login == 1 ? <Redirect to="/" /> : <Login />}</Route>
          <Route path="/register">
            {login == 1 ? <Redirect to="/" /> : <Register />}
          </Route>

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
