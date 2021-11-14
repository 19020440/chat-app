import { useContext, useEffect, useLayoutEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import {observer} from 'mobx-react-lite'
import {useStore} from '../../hook';
import _ from 'lodash';



const Feed = observer(({ userId }) => {
  const [posts, setPosts] = useState([]);
  const AuthStore = useStore('AuthStore');
  const ActionStore = useStore('ActionStore');
  const {user} = AuthStore;
  useLayoutEffect(() => {
    
    fetchPosts();
  }, [userId, user?._id, ActionStore.statusPost]);

  const fetchPosts = async () => {
    // const res = userId
    //   ? await axios.get("/posts/profile/" + userId)
    //   : await axios.get("posts/timeline/" + user?._id);
      const res = userId ? await ActionStore.action_getPost(userId)
      : user._id ? await ActionStore.action_getPostTimeLine(user?._id) : null
      res && setPosts(
        res.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    console.log(res);
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!userId || userId === user._id) && <Share />}
        {!_.isEmpty(posts) && posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
} ) 

export default Feed;
 
