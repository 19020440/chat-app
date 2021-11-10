import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash'
const Profile = observer(() => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const userId = useParams()._id;
  const history = useHistory();
  const ActionStore = useStore('ActionStore');
  const AuthStore = useStore('AuthStore');
  useEffect(() => {
    console.log(userId);
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    if(userId == AuthStore.user._id){
      setUser(AuthStore.user);
      return;
    }
    const res = await ActionStore.action_getProfile(userId);
    !res && history.goBack();
    setUser(res);
  }; 
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
                {!_.isEmpty(user) && 
                  <>
                    <Feed userId={user._id} />
                    <Rightbar user={user} />
                  </>
                }
          
          </div>
        </div>
      </div>
    </>
  );
}) 

export default Profile;
  
