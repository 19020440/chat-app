import axios from "axios";
import { useEffect, useState } from "react";
import "./search.css";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'

const Search = observer(({ user }) => {
  const ActionStore = useStore('ActionStore');
//   const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


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
  

