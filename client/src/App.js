import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
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
  useEffect(() => {
    AuthStore.action_setSocket(socket)
    validLogin();
  },[]) 
  //get conversation 
  useEffect(() => {
    const getConversations = async () => {
     
      if(!_.isEmpty(AuthStore.user) && _.isEmpty(ActionStore.conversations)) {
        console.log("login: ", login);
        try {
          const res = await ActionStore.action_getConversation(AuthStore.user?._id);
          const arrCovId = res.map((value) => {
            return value._id;
          })
          AuthStore.action_setListRoom(arrCovId);
          AuthStore.socket.emit("first_join_room", arrCovId);
          console.log(AuthStore.user?.socketId);
          AuthStore.socket?.emit("online",{email: AuthStore.user?.email, id :  AuthStore.user?.socketId,arrCovId: arrCovId});
        } catch (err) {
          console.log(err);
        } 
      }
      
    };
   if(login == 1) getConversations();
  }, [login]);

  useEffect(() => {
    socket.on("connect", () => {
      AuthStore.action_setCallVideoSocketId(socket.id)
    });
  },[]);
  useEffect(() => {
   //join_room
    AuthStore.socket?.on("setJoin_room", (data) => {
      console.log("user send is:", data.senderId);
      ActionStore.action_updateStatusSeenConversation(data , "join");
      AuthStore.action_setSatusSeenText();
    })

    //setjoin_room
    AuthStore.socket?.on("setOnline", (data) => {
      const result = AuthStore.listRoom.filter(function(n) { return data.arrCovId.indexOf(n) !== -1;});
      console.log(result);
      if(!_.isEmpty(result)) {
        for(let i=0;i<_.size(result);++i) {
          ActionStore.action_updateStatusSeenMembers({conversationId: result[i], senderId: data.userOnlineId} , "join");
        }
        ActionStore.action_setOfflientStatus();
        AuthStore.socket.emit("answerOnline", {covId: result,userId: AuthStore.user._id})
      }
     })

    AuthStore.socket?.on("setUserOffline", ({arrCov, userId}) => {
      const result = AuthStore.listRoom.filter(function(n) { return arrCov.indexOf(n) !== -1;});
      if(!_.isEmpty(result)) {
        for(let i=0;i<_.size(result);++i) {
          ActionStore.action_updateStatusSeenMembers({conversationId: result[i], senderId: userId} , "out");
          
        }
        ActionStore.action_setOfflientStatus();
        
      }
    }) 

    AuthStore.socket.on("receive_anwerOnline", async (data) => {
      for(let i=0;i<_.size(data.covId);++i) {
        console.log(i);
        ActionStore.action_updateStatusSeenMembers({conversationId: data.covId[i], senderId: data.userId} , "join");
      }
      await ActionStore.action_setOfflientStatus();
    })


    AuthStore.socket?.on("setout_room", (data) => {
      ActionStore.action_updateStatusSeenConversation(data, "out")
    })

    AuthStore.socket?.on("getMessage", (data) => {

     ActionStore.action_updateConnversationById({
       updatedAt:Date(data.updatedAt),
       lastText: {
         sender: data.senderId,
         text: data.text,
         seens: data.seens,
         seen: data.seen
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
    {/* <Router> */}
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
    {/* </Router> */}

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
