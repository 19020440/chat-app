
  import {  useRef, useState } from "react";
import {store, updateFrame, birdjump, game, states, rungame, resetGame} from '../../Store/store'
  import "./conversation.css";
  import {useStore} from '../../hook';
  import {observer} from 'mobx-react-lite'
  import _ from 'lodash'
  import {searchSendMess, sortConversationByUpdateAt, FilterTypeConversation} from '../../helper/function'
  import ProfileRight from '../ProfileRight/ProfileRight'
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { fab } from '@fortawesome/free-brands-svg-icons'
  import {faArrowLeft, faEllipsisH,faPenSquare,faSearch,faUsers,faVideo } from '@fortawesome/free-solid-svg-icons'
  import { useHistory } from "react-router-dom";
  import SearchFriend from '../searchFriend/search'
  import {Image, Modal,Row,Tooltip, Col, Typography, Button, Spin, Form, Input} from 'antd'
  import {PersonAdd,GroupAdd, Close} from '@material-ui/icons'
import FlappyBird from "../Game/FlappyBird";
import Game from "../Game/chess";
library.add( fab,faEllipsisH,faVideo,faPenSquare,faSearch,faArrowLeft,faUsers) 


function onpress(evt) {

  switch (game.currentstate) {
  default:
  case states.Splash:
    rungame()
    birdjump(store.bird)
    break
  case states.Game:
    birdjump(store.bird)
    break
  case states.Score:
    break
}

}
const {Text} = Typography;
const Conversation = observer(() => {
    const {Search} = Input;
    const ActionStore = useStore('ActionStore');
    const AuthStore = useStore('AuthStore');   
    const {user} = AuthStore;   
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
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
    const [showModalBird, setShowModalBird] = useState(false);
  const [showModalChess, setShowModalChess] = useState(false);
  const [playComputer, setPlayComputer] = useState(false);
  const [playHuman, setplayHuman] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typeConversation, setTypeConversation] = useState(1);
  const searchPeopleRef = useRef();
  //Modal Chess
  const ModalChess = (status) => {
    return (
      <Modal footer={false}
        visible={status}
        className="modal_chess"
        bodyStyle={{height: '100%'}}
        style={{height: '100%'}}
        bodyStyle={{padding: '0'}}
        closeIcon={<Close style={{color: 'white'}}/>}
        onCancel={() => {
          setShowModalChess(false);
          setPlayComputer(false);
          setplayHuman(false);
        }}
      >
        {/*  */}
        {!playComputer && !playHuman && <> 
          {isLoading&&<Spin style={{position: 'fixed', top: '50%', right: '47%',zIndex: '2'}}></Spin>}
          <Image src="https://www.teahub.io/photos/full/274-2748407_match-wallpapers-desktop-wallpaper-goodwp-chess-high.jpg" style={{position: 'fixed', top: 0, right: 0, bottom: 0, left: 0}} preview={false}/>
          <Row style={{width: '300px', position: 'fixed', top: '70%', right: '38%', textAlign: 'center'}} >
            <Col span={24} style={{marginBottom: '20px'}}>
              <Button style={{ background: 'brown', border: 'none', color: 'white', fontWeight: '550', borderRadius: '20px',width: '50%' }} onClick={() => {
                  
                  setIsLoading(true);
                  const time = setTimeout(() => {
                    setPlayComputer(true);
                    setIsLoading(false);
                    clearTimeout(time);
                  }, 3000)
              }}>Chơi với máy</Button>
            </Col>
            <Col span={24}>
              <Button style={{ background: 'brown', border: 'none', color: 'white', fontWeight: '550', borderRadius: '20px',width: '60%' }}>Chơi với bạn bè</Button>
            </Col>
          </Row>
        </>}
        {playComputer && <Game />}
        
      </Modal>
    )
  }
  
  //Modal Bird
    const ModalBird = (status) => {
      return (
        <Modal visible={status} onCancel={() => {
          setShowModalBird(false);
          // resetGame();
          document.removeEventListener('mousedown', onpress)
        }}
        bodyStyle={{padding: '0', width: '320px'}}
          footer={false}
          className="bird_modal"
        >
            <FlappyBird store={store} updateFrame={updateFrame} game={game}/>
        </Modal>
      )
    }
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
    searchPeopleRef.current.value = ""
    history.push(`/messenger/${result._id}`);
  }


  //show modal create group
  const modalGroup = (isModalVisible) => {
    
    const handleInviteGroup = (e,userId) => {
      
      Object.assign(listUserInvite.current, {[userId._id]: {...userId,seen: false}});
      const dataSourse = [...modalSearchList]
      const result = dataSourse.map(value => {
        if(value._id == userId._id) value.seen = true;
        return value;
      })
      setModalSearchList(result)
    }
    const handleDeleteGroup = (e,userId) => {
      delete listUserInvite.current[userId._id]
      const dataSourse = [...modalSearchList]
      const result = dataSourse.map(value => {
        if(value._id == userId._id) value.seen = false;
        return value;
      })
      setModalSearchList(result)
    }
    const handleCreateGroup = () => {
      if(createNameGroup.current.value != "") {
        const arrMembers = Object.values(listUserInvite.current);
        const listUser = Object.keys(listUserInvite.current)
        const truearr = arrMembers.map(value => {
          const {_id,...rest} = value;
          return {...rest,id: value._id}
        })
        try {
          AuthStore.socket.emit("invite_to_group", {name: createNameGroup.current.value, 
            members: [...truearr,{id: AuthStore.user._id, profilePicture: AuthStore.user?.profilePicture, username: AuthStore.user?.username, isAdmin: true}],
            listUser,
            user: AuthStore.user
          });
        } catch (err) {
          console.log(err);
        }
        
        setModalSearchList([]);
        listUserInvite.current ={};
        setShowModalGroup(false);
        createNameGroup.current.value = "";
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
            <Form 
            style={{width: '100%'}}
            form={form}
            >
                <Form.Item> 
                  <Search  placeholder="Tìm kiếm" allowClear onChange={(e) => {
                    // searchSendMess(listSend)
                    const result = searchSendMess(ActionStore.listCreateGroup, e.target.value);
                    setModalSearchList(result);
                  }}/>
                </Form.Item>
               
            </Form>
            </div>
            <span>Bạn bè</span>
            <div className="main-modal_showGroup-row">
                {!_.isEmpty(modalSearchList) && modalSearchList.map(value => {
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
    form.resetFields();
    setModalSearchList([]);
    setShowModalGroup(false);
  }

  const getListModalGroup = async () => {
    const result = await ActionStore.action_getListFriend(user?._id);
    setModalSearchList(result)
  }

  //invited friend

  const invitedModal = (visible) => {

    const addUser = async (e,userId) => {
      const res = await AuthStore.action_addFriend(true, userId._id);
      
      if(res && !_.isEmpty(AuthStore?.socket)) {
        AuthStore.action_setListFollow(userId._id)
        try {
          const  saveNotify = await ActionStore.action_saveNotify({userId: userId?._id, profilePicture: AuthStore?.user?.profilePicture, 
            des: `${AuthStore?.user?.username} đã kết bạn với bạn`});
          if(saveNotify) {
            AuthStore?.socket?.emit("invite_success", saveNotify)
          }
          
        } catch(err) {
          console.log(err);
        }
       
        const result = listUserAdd.map(user => {
            if(user._id == userId._id) user.seen = true;
            return user;
          })
          AuthStore.action_addUser();
        setListUserAdd(result)
      }
     
    }

    const handleCancelAdd = () => {
      setShowModalInvite(false);
      form1.resetFields();
    }
    return (
     <Modal
      title="Thêm bạn bè"
      visible={visible}
      cancelText={<></>}
      okText="Hủy"
      onCancel={handleCancelAdd}
      onOk={handleCancelAdd}
     >
          <div className="main-modal_showGroup">
            <div className="main-modal_showGroup-search">
              <Form 
              style={{width: '100%'}}
              form={form1}
              >
                  <Form.Item> 
                    <Search  placeholder="Tìm kiếm" allowClear onChange={(e) => {
                      // searchSendMess(listSend)
                      const result = searchSendMess(AuthStore.listAddFriend, e.target.value);
                      setListUserAdd(result);
                    }}/>
                  </Form.Item>
                
              </Form>
            </div>
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
                                    ref={searchPeopleRef}

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
                                <li className="container-left__item">
                                    <span style={{height: '23px', textAlign: 'center', background: `${typeConversation == 1 ? '#9090e6' : 'white'}`,padding: '4px', borderRadius: '20px', fontSize: '9px', marginRight: '3px'}}
                                      onClick={() => {
                                        setTypeConversation(1)
                                      }}
                                    >Tất cả</span>
                                    <span style={{height: '23px', textAlign: 'center', background: `${typeConversation == 2 ? '#9090e6' : 'white'}`,padding: '4px', borderRadius: '20px', fontSize: '9px', marginRight: '3px'}}
                                      onClick={() => {
                                        setTypeConversation(2);
                                      }}
                                    >Bạn bè</span>
                                    <span style={{height: '23px', textAlign: 'center', background: `${typeConversation == 3 ? '#9090e6' : 'white'}`,padding: '4px', borderRadius: '20px', fontSize: '9px', marginRight: '3px'}}
                                      onClick={() => {
                                        setTypeConversation(3);
                                      }}
                                    >Nhóm</span>
                                </li>
                            {actionSearchPeple ?
                              _.isEmpty(ActionStore.listSearch) ? <> <li className="container-left__item">Không tìm thấy kết quả phù hợp</li> </>
                              :ActionStore.listSearch.map((user) => (
                                <div onClick={() => handlenewConversation(user)}>
                                  <SearchFriend user={user} />
                                </div>
                              ))
                              
                            : !AuthStore.showGame ? 
                            
                            FilterTypeConversation(conversations,typeConversation).map((conversation,index) => {
                                return (
                                    < >
                                    <li className="container-left__item" onClick={async () => {
                                        await handlePassPage(conversation);
                                    }}>
                                        <ProfileRight 
                                          conversation={conversation} 
                                          seen={conversation.lastText?.seens.filter(value => value.id == AuthStore.user._id)}
                                          isGroup={conversation.name? true:false}
                                        />
                                    </li>
                                    </>
                                )
                            })
                            : <>
                            
                                <li className="container-left__item" onClick={() => {
                                    document.addEventListener('mousedown', onpress)
                                    setShowModalBird(true);
                                }}>
                                    <Row align="middle" style={{width: '100% '}}>
                                      <Col span={4}>
                                        <Image src="https://media.vneconomy.vn/w800/images/upload/2021/04/21/Flappy-Bird33167.jpg" style={{borderRadius: '50%', width: '50px', height: '50px'}}/>
                                      </Col>
                                      <Col span={7  }>
                                        <Text strong>FLAPPY BIRD</Text>
                                      </Col>
                                    </Row>
                                </li>

                                <li className="container-left__item" onClick={() => {
                                 setShowModalChess(true)
                                  }}>
                                  <Row align="middle" style={{width: '100% '}}>
                                    <Col span={4}>
                                      <Image src="https://cdn.britannica.com/w:400,h:300,c:crop/71/7471-004-C94F7C98/chessmen-Position-beginning-game-queen-rook-king.jpg" style={{borderRadius: '50%', width: '50px', height: '50px'}}/>
                                    </Col>
                                    <Col span={7  }>
                                      <Text strong>CHESS</Text>
                                    </Col>
                                  </Row>
                                </li>
                            </>
                            }
                                

                        </ul>
                    </div>
                    {modalGroup(showModalGroup)}
                    {invitedModal(showModalInvite)}
                    {showModalBird && ModalBird(showModalBird)}
                    {showModalChess && ModalChess(showModalChess)}
                    
                </div>
  );
});
export default Conversation;
  

