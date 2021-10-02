import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext, useEffect, useLayoutEffect } from "react";

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
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');
  const {user, login} = AuthStore;

  useLayoutEffect(() => {
    AuthStore.action_setSocket(socket)
    validLogin();
  },[]) 

  useEffect(() => {
   
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
   
 },[]);

  const validLogin = async () => {
    
    const token = await sessionStorage.getItem('token');
    !token && AuthStore.action_setLogin(0);
    token && await AuthStore.action_valdLogin();
    
  }
  return (
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

        <ProtectedRoute 
          path="/"
          component={PrRouter}
          login={login}
          />

      </Switch>
    </Router>
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
