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
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import {observer} from 'mobx-react-lite'
import {useStore} from './hook'
import Loading from "./components/Loading/Loading";
import PrRouter from "./pages/PrRouter";
import Chat from './pages/chat/Chat'
import _ from 'lodash';
import io from 'socket.io-client'
const socket = io.connect("http://localhost:8800");
const App = observer(() => {
  // const { user } = useContext(AuthContext);
  const AuthStore = useStore('AuthStore');
  const {user, login} = AuthStore;

  useLayoutEffect(() => {
    AuthStore.action_setSocket(socket)
    validLogin();
  },[])

  useEffect(() => {
    AuthStore.socket?.emit('validLogin');
    AuthStore.socket?.on('setvalidLogin', (socketId) => {
      AuthStore.socket?.emit("online",{email: AuthStore.user?.email, id : socketId});
    })
  },[AuthStore.socket])

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
        <Route path="/chat"><Chat /></Route>
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
