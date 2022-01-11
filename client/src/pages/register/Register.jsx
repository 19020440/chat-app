import axios from "axios";
import { useRef } from "react";
import {Link} from 'react-router-dom'
import "./register.css";
import { useHistory } from "react-router";
import {observer} from 'mobx-react-lite';
import {useStore} from '../../hook'
import  {showMessageError} from '../../helper/function'
 const Register = observer(() =>  {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const AuthStore = useStore('AuthStore');

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(passwordAgain.current.value + " " +  password.current.value);
    if (passwordAgain.current.value !== password.current.value) {
      showMessageError("Mật khẩu không trùng nhau!")
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      const result = await AuthStore.action_register(user);
      result && history.push("/login");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social App</h3>
          <span className="loginDesc">
          Kết nối với bạn bè và thế giới xung quanh bạn trên Social App.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit">
              Nhấn để đăng ký
            </button>
            <button className="loginRegisterButton" onClick={(e) => {
              e.preventDefault();
              history.push('/login')
            }}><span>Đăng nhập</span></button>
          </form>
        </div>
      </div>
    </div>
  );
});
export default Register;
