import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'

const Conversation = observer(({ conversation, currentUser }) => {
  const ActionStore = useStore('ActionStore');
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        // const res = await axios("/users?userId=" + friendId);
        const res = await ActionStore.action_getProfile(friendId);
 
        setUser(res);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <>
    
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
    </>
  );
});
export default Conversation;
  

