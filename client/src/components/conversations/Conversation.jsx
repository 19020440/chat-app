
  import {  useRef, useState } from "react";

  import "./conversation.css";
  import {useStore} from '../../hook';
  import {observer} from 'mobx-react-lite'
  import _ from 'lodash'
  import {sortConversationByUpdateAt} from '../../helper/function'
  import ProfileRight from '../ProfileRight/ProfileRight'
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { fab } from '@fortawesome/free-brands-svg-icons'
  import {faArrowLeft, faEllipsisH,faPenSquare,faSearch,faUsers,faVideo } from '@fortawesome/free-solid-svg-icons'
  import { useHistory } from "react-router-dom";
  import SearchFriend from '../searchFriend/search'
  import {Modal,Tooltip} from 'antd'
  import {PersonAdd,GroupAdd} from '@material-ui/icons'
library.add( fab,faEllipsisH,faVideo,faPenSquare,faSearch,faArrowLeft,faUsers) 

const Conversation = observer(() => {
    const ActionStore = useStore('ActionStore');
    const AuthStore = useStore('AuthStore');      
    const conversations = sortConversationByUpdateAt(ActionStore.conversations);
    const history = useHistory();
    const [actionSearchPeple,setActionSearchPeople] = useState(false);
    const [showModalGroup,setShowModalGroup] = useState(false);
    const [modalSearchList,setModalSearchList] = useState([]);
    const listUserInvite = useRef({});
    const [showModalInvite, setShowModalInvite] = useState(false);
    const [listUserAdd, setListUserAdd] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const createNameGroup = useRef(null);
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


  //show modal create group
  const modalGroup = (isModalVisible) => {
    
    const handleInviteGroup = (e,userId) => {
      
      Object.assign(listUserInvite.current, {[userId._id]: {...userId,seen: false}});
      const result = modalSearchList.map(value => {
        if(value._id == userId._id) value.seen = true;
        return value;
      })
      setModalSearchList(result)
    }
    const handleDeleteGroup = (e,userId) => {
      delete listUserInvite.current[userId._id]
      const result = modalSearchList.map(value => {
        if(value._id == userId._id) value.seen = false;
        return value;
      })
      setModalSearchList(result)
    }
    const handleCreateGroup = () => {
      if(createNameGroup.current.value != "") {
        const arrMembers = Object.values(listUserInvite.current)
        AuthStore.socket.emit("invite_to_group", {name: createNameGroup.current.value, members: arrMembers});
        setModalSearchList([]);
        listUserInvite.current ={};
        setShowModalGroup(false);
      }
      
    }
    return (
      <Modal title="Tạo nhóm" visible={isModalVisible}  onCancel={handleCancelGroup} className="modal-group" 
        onOk={handleCreateGroup}
        cancelText="Huỷ"
        okText="Tạo"
      >
        <div className="main-modal_showGroup">
            <div className="main-modal_showGroup-search">
                <FontAwesomeIcon icon={faSearch}/>
                <input type="text" placeholder="Tìm kiếm"/>
            </div>
            <span>Bạn bè</span>
            <div className="main-modal_showGroup-row">
                {modalSearchList.map(value => {
                  console.log(listUserInvite.current);
                  return (
                    <div className="main-modal_showGroup-col">
                      <div className="main-modal_showGroup-col-info">
                        <img src={value.profilePicture ? value.profilePicture  : PF + "person/noAvatar.png"} className="main-modal_showGroup-col-img" />
                        <span>{value.username}</span>
                      </div>
                      <button onClick={(e) => {
                        handleInviteGroup(e,value)
                        }}
                        className="modal-group-button_invite"
                        hidden={value?.seen?true:false}
                        >Mời vào nhóm</button>
                        <button onClick={(e) => {
                        handleDeleteGroup(e,value)
                        }}
                        className="modal-group-button_cancel_invite"
                        hidden={value?.seen?false:true}
                        >Hủy chọn</button>
                    </div>
                  )
                })}
            </div>
            
        </div>
        <div style={{padding: "10px"}}>
          <input ref={createNameGroup} style={{width: "100%", border: "none", outline: "none",background: "#f0f2f5",padding: "5px",height: "33px"}} placeholder="Tên nhóm"/>
        </div>
      </Modal>
    )
  }


  const handleCancelGroup = () => {
    listUserInvite.current ={};
    setModalSearchList([]);
    setShowModalGroup(false);
  }

  const getListModalGroup = async () => {
    const result = await ActionStore.action_getListFriend(AuthStore.user._id);
    setModalSearchList(result)
  }

  //invited friend

  const invitedModal = (visible) => {

    const addUser = async (e,userId) => {
      const res = await AuthStore.action_addFriend(true, userId._id);
      if(res) {
        const result = listUserAdd.map(user => {
          console.log(user);
            if(user._id == userId._id) user.seen = true;
            return user;
          })
          AuthStore.action_addUser();
        setListUserAdd(result)
      }
     
    }

    const handleCancelAdd = () => {
      setShowModalInvite(false)
    }
    return (
     <Modal
      title="Thêm bạn bè"
      visible={visible}
      onCancel={handleCancelAdd}
     >
          <div className="main-modal_showGroup">
            
            <span>Bạn bè</span>
            <div className="main-modal_showGroup-row">
                {listUserAdd.map(value => {
                  return (
                    <div className="main-modal_showGroup-col">
                      <div className="main-modal_showGroup-col-info">
                        <img src={value.profilePicture ? value.profilePicture : PF + "person/noAvatar.png"} className="main-modal_showGroup-col-img" />
                        <span>{value.username}</span>
                      </div>
                      <button onClick={(e) => addUser(e, value)}
                        className="modal-group-button_invite"
                        hidden={value?.seen?true:false}
                        >Thêm bạn</button>
                        <button 
                        className="modal-group-button_cancel_invite"
                        hidden={value?.seen?false:true}
                        >Đã thêm</button>
                    </div>
                  )
                })}
            </div>
            
        </div>
        
     

    
    </Modal>
    )
  } 



  
  return (
    <div className="container-left">
                    <div className="container-left__head">
                        <div className="container-left__head-top">
                            <div className="container-left__head-top-title">
                              <div className="container-left__head-search">
                                <div className="container-left__search-box">
                                    <div className="container-left__search-box-icon">
                                      <FontAwesomeIcon icon={faSearch} className={actionSearchPeple?"hidden_icon":""}/>
                                      <FontAwesomeIcon icon={faArrowLeft} className={!actionSearchPeple?"hidden_icon":""} onClick={handleEndSearch}/>
                                    
                                    </div>
                                    <input type="text" 
                                    className="container-left__search-box-input" 
                                    placeholder="Tìm kiếm cuộc hội thoại"
                                    onChange={(e) => handleSearchPeople(e)}
                                    />
                                </div>
                              </div>
                            </div>

                            <div className="container-left__head-top-group">
                                
                                <div className="container-left__head-group-btn" onClick={async () => {
                                  setShowModalInvite(true);
                                  const result  = await AuthStore.action_get_list_invite(AuthStore.user?._id);
                                  setListUserAdd(result)
                                }}>
                                    <Tooltip title="Thêm bạn"  overlayStyle={{color: "black"}}>
                                      <PersonAdd />
                                    </Tooltip>
                                   
                                </div>
                                <div className="container-left__head-group-btn" onClick={async() => {
                                  getListModalGroup();
                                  setShowModalGroup(true);
                                }}>
                                  <Tooltip title="Tạo nhóm"  overlayStyle={{color: "black"}}>
                                    <GroupAdd />
                                  </Tooltip>
                                    
                                </div>
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
                                        await handlePassPage(conversation);
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
                    {modalGroup(showModalGroup)}
                    {invitedModal(showModalInvite)}
                </div>
  );
});
export default Conversation;
  

