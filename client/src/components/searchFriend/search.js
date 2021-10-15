import axios from "axios";
import { useEffect, useState } from "react";
import "./search.css";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'

const Search = observer(({ user }) => {
  const ActionStore = useStore('ActionStore');
  const AuthStore = useStore('AuthStore');
//   const [user, setUser] = useState(null);
  const currentUser= AuthStore.user;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // useEffect(() => {
    
  //   const getUser = async () => {
  //     try {
  //       // const res = await axios("/users?userId=" + friendId);
  //       const res = await ActionStore.action_getProfile(user._id);
  //       ActionStore.action_setProfileOfFriend(res);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getUser();
  // }, [currentUser]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          user?.profilePicture
            ? user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
});
export default Search;
  

