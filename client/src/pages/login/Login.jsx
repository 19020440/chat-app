import { useContext, useRef } from "react";
import "./login.css";
import {useHistory} from 'react-router-dom'
import { CircularProgress } from "@material-ui/core";
import {Link} from 'react-router-dom'
import {useStore} from '../../hook'
import {observer} from 'mobx-react-lite'
import _, { isEmpty } from 'lodash'
const  Login = observer(() => {
  const AuthStore = useStore('AuthStore');
  const email = useRef();
  const password = useRef();

  const history = useHistory();
  const handleClick = async (e) => {
    e.preventDefault();
    const result = await AuthStore.action_login( { email: email.current.value, password: password.current.value });
    if(result) history.push('/messenger')
    // console.log(AuthStore.socket.id);

  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit">
              Log In
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
                <Link to="/register">Create a New Account</Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}) 

export default Login;
 

