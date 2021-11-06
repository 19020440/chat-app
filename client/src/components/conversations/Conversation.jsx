import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import "./conversation.css";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash'
import {sortConversationByUpdateAt,findObjectFromArrayLodash} from '../../helper/function'
import ProfileRight from '../ProfileRight/ProfileRight'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faArrowLeft, faEllipsisH,faPenSquare,faSearch,faVideo } from '@fortawesome/free-solid-svg-icons'
import { useHistory,useParams } from "react-router-dom";
import SearchFriend from '../searchFriend/search'
library.add( fab,faEllipsisH,faVideo,faPenSquare,faSearch,faArrowLeft) 

const Conversation = observer(() => {
    const ActionStore = useStore('ActionStore');
    const AuthStore = useStore('AuthStore');      
    const conversations = sortConversationByUpdateAt(ActionStore.conversations);
    const history = useHistory();
    const beforeConversation = useRef(null);
    const currentConversation = useRef(null);
    const [actionSearchPeple,setActionSearchPeople] = useState(false);
    const [conversationId,setConversationId] = useState(null);

    const handlePassPage =  (conversation) => {
      history.push(`/messenger/${conversation._id}`);  
    }
  
  //SEARCH FRIEND
  const handleSearchPeople = (e) => {
      setActionSearchPeople(true);
    ActionStore.action_searchFriend(e.target.value);
  }

  //END SEARCH
  const handleEndSearch = () => {
    ActionStore.action_resetListSearchFriend();
    setActionSearchPeople(false);
  }

  // create new conversation 
  const handlenewConversation = async (user) => {
    const result = await ActionStore.action_getCovBySearch(AuthStore?.user._id,user?._id);
    setActionSearchPeople(false);
    history.push(`/messenger/${result._id}`);
  }



  
  return (
    <div className="container-left">
                    <div className="container-left__head">
                        <div className="container-left__head-top">
                            <div className="container-left__head-top-title">
                                Chat
                            </div>
                            <div className="container-left__head-top-group">
                                <div className="container-left__head-group-btn">
                                    <FontAwesomeIcon icon="fa-solid fa-ellipsis-h" />
                                </div>
                                <div className="container-left__head-group-btn">
                                    <FontAwesomeIcon icon="fa-solid fa-video" />
                                </div>
                                <div className="container-left__head-group-btn">
                                    <FontAwesomeIcon icon={faPenSquare} />
                                </div>
                            </div>
                        </div>
                        <div className="container-left__head-search">
                            <div className="container-left__search-box">
                                <div className="container-left__search-box-icon">
                                  <FontAwesomeIcon icon={faSearch} className={actionSearchPeple?"hidden_icon":""}/>
                                  <FontAwesomeIcon icon={faArrowLeft} className={!actionSearchPeple?"hidden_icon":""} onClick={handleEndSearch}/>
                                
                                </div>
                                <input type="text" 
                                className="container-left__search-box-input" 
                                placeholder="Tìm kiếm trên Messenger"
                                onChange={(e) => handleSearchPeople(e)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="container-left__body">
                        <ul className="container-left__list">

                            {actionSearchPeple ?
                              _.isEmpty(ActionStore.listSearch) ? <> <span>Không tìm thấy kết quả phù hợp</span> </>
                              :ActionStore.listSearch.map((user) => (
                                <div onClick={() => handlenewConversation(user)}>
                                  <SearchFriend user={user} />
                                </div>
                              ))
                              
                            :conversations.map((conversation,index) => {
                                return (
                                    < >
                                    <li className="container-left__item" onClick={async () => {
                                        currentConversation.current = conversation?._id
                                        await handlePassPage(conversation);
                                        beforeConversation.current = conversation?._id;
                                        
                                    }}>
                                        <ProfileRight 
                                        conversation={conversation} 
                                        seen={conversation.lastText?.seens.filter(value => value.id == AuthStore.user._id)}
                                        isGroup={_.size(conversation.members) > 2? true:false}
                                        
                                        />
                                    </li>
                                    </>
                                )
                            })
                            }
                                

                        </ul>
                    </div>
                </div>
  );
});
export default Conversation;
  

