
import Login from "./pages/login/Login";

import Register from "./pages/register/Register";
import { Modal, Row, Col } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  
} from "react-router-dom";
import {  useEffect, useLayoutEffect, useRef, useState } from "react";
import{showMessageError, showMessageSuccess} from './helper/function'
import {observer} from 'mobx-react-lite'
import {useStore} from './hook'
import Loading from "./components/Loading/Loading";
import PrRouter from "./pages/PrRouter";
import 'antd/dist/antd.css';
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
  AuthStore.action_setSocket(socket)
  const {user, login} = AuthStore;
  const from = useRef();
  const [userCall, setUserCall] = useState();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const signal = useRef();
  const newRoomId = useRef();
  useEffect(() => {
    
    validLogin();
  },[]) 

  useEffect(() => {
    //get conversation 
    const getConversations = async () => {
     
    
      try {
        const res = await ActionStore.action_getConversation(AuthStore.user?._id);
        const arrCovId = res.map((value) => {
          return value._id;
        })
        
        AuthStore.action_setListRoom(arrCovId);
        // if(!_.isEmpty(AuthStore?.socket)) {
          AuthStore.socket.emit("first_join_room", arrCovId);
          AuthStore?.socket?.on("first_join_room", status => {
            AuthStore.socket?.emit("online",{email: AuthStore.user?.email, id :  socket.id,arrCovId: arrCovId});
          })
         
        // }
      } catch (err) {
        console.log(err);
      } 
     
      
  };
   if(login == 1) {
     getConversations();
    
   }
  }, [login, AuthStore.status_addUser,AuthStore?.socket, AuthStore.doiten]);

  //lay thong bao 

  useEffect(() => {
    if(login==1) getlistNotify();
  }, [login])
  const getlistNotify = async () => {
    const listNotify = await ActionStore.action_getListNotify(AuthStore?.user?._id);
  }


  useEffect(() => {
    socket.on("connect", () => {
      AuthStore.action_setCallVideoSocketId(socket.id)
    });
  },[]);
  useEffect(() => {
    
    
    //upload_image
    AuthStore.socket?.on("upload_image", ({covId, userId, src}) => {
      console.log("okeee");
      ActionStore.action_uploadImageInCov({covId, userId, src});
    })
   //join_room
    AuthStore.socket?.on("setJoin_room", (data) => {
      ActionStore.action_updateStatusSeenConversation(data , "join");
      AuthStore.socket.emit("answer_join_room", {senderId: user?._id, conversationId: data.conversationId});
      AuthStore.action_setSatusSeenText();
    })
    //CHinh sua biet danh
    AuthStore.socket?.on("edit_bietdanh", () => {
      AuthStore.action_doiten();
    })
    //them thanh vien vao nhom 
    AuthStore.socket?.on("add_member_cov", () => {
      AuthStore.action_doiten();
    })

    AuthStore.socket?.on("edit_tennhom", () => {
      AuthStore.action_doiten();
    })

    AuthStore.socket?.on("delete_user", () => {
      AuthStore.action_doiten();
    })

    AuthStore.socket?.on("leave_group", () => {
      AuthStore.action_doiten();
    })
//tra loi join room
    AuthStore.socket.on("answer_join_room", data => {
      ActionStore.action_updateStatusSeenConversation(data , "join");
      ActionStore.action_setAnswerJoinRoom();
    })

    //setjoin_room
    AuthStore.socket?.on("setOnline", (data) => {
      const result = AuthStore.listRoom.filter(function(n) { return data.arrCovId.indexOf(n) !== -1;});
      console.log("setOnline:", data);
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

    AuthStore.socket.on("update_notify_invite", async ({res, name}) => {
      try {
        await ActionStore.action_saveNotify({userId: res?._id, profilePicture: AuthStore?.user?.profilePicture, 
          des: `${AuthStore?.user?.username} ???? m???i b???n v??o nh??m ${name}`});
      } catch(err) {
        console.log(err);
      }
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
      if(data.from._id != AuthStore.user?._id) {
        console.log(data);
        from.current = data.roomId;
        newRoomId.current = data?.newRoomId;
        setUserCall(data.from)
        setVisible(true);
      }
     
    })
    //get_error
    AuthStore.socket.on('send_error', text => {
      showMessageError(text);
    })


    AuthStore.socket.on("invite_to_group", status => {
      if(_.isEmpty(status)) showMessageError("T???o nh??m th???t b???i !");
      else {
        // 
        AuthStore.action_doiten();
      }
    })

    AuthStore.socket.on("status_invite_to_group", status => {
      if(!status) showMessageError("T???o nh??m th???t b???i !");
      else {
        AuthStore.action_doiten();
        showMessageSuccess("T???o nh??m th??nh c??ng");
        
      }
    })

    AuthStore.socket.on("invite_success", () => {
      AuthStore.action_doiten();
    })

    AuthStore.socket.on("close_tab", data => {
      window.close();
    })
  
   
 },[socket]);

 

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
    window.open(`/callvideo?from=${AuthStore.user?._id}&room=${from.current}&status=1`, "_blank")
    
  }

 // tu choi call video
 const handleCancel = async () => {
  setVisible(false);
  const saveNotify = await ActionStore.action_saveNotify({userId: userCall?._id, profilePicture: AuthStore?.user?.profilePicture, 
    des: `${AuthStore?.user?.username} ???? t??? ch???i tr??? l???i`});
    if(saveNotify) {
      AuthStore.socket.emit("end_call", {notify: saveNotify, covId: from.current, newRoomId: newRoomId.current});
    }
   
   
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
                title="C?? cu???c g???i"
                visible={visible}
                onOk={handleOk}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Tr??? l???i"
                cancelText="T??? ch???i"
            >
              <Row align="middle">
                <Col span={2}>
                  <img src={
                  userCall?.profilePicture
                      ? userCall?.profilePicture
                      : PF + "person/noAvatar.png"
                  } alt="" className="header-profile__img avt" 
                    style={{borderRadius: '50%'}}
                  />
                </Col>
                <Col span={6} style={{marginLeft: '20px'}}>
                  <span>{userCall?.username}</span>
                </Col>
              </Row>
              

               

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
