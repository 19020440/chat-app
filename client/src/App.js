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
const App = observer(() => {
  // const { user } = useContext(AuthContext);
  const AuthStore = useStore('AuthStore');
  const {user, login} = AuthStore;

  useLayoutEffect(() => {
    validLogin();
  },[])

  const validLogin = async () => {
    const token = await sessionStorage.getItem('token');
    token && await AuthStore.action_valdLogin();
  }
  return (
    <Router>
      <Switch>
        <Route exact path="/">
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
        </Route>
      </Switch>
    </Router>
  );

})
  


export default App;
