import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import {findIndexLastTextSeen,sortConversationByUpdateAt} from '../../helper/function'
import { useContext, useEffect, useRef, useState } from "react";
import { Switch, Route,Link, useParams} from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash';
import Search from '../../components/searchFriend/search'
import ChatBox from '../../components/ChatBox/Chat'
import ChatEmpty from "../../components/ChatEmpty/ChatEmpty";
import Header from '../../components/header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faAirFreshener, faGift, faInfoCircle, faPhone, faPlusCircle, faPortrait,faArrowAltCircleRight,faThumbsUp} from '@fortawesome/free-solid-svg-icons'
import ContrainerMess from "../../components/ContainerMess/ContrainerMess";
library.add(fab,faPhone,faInfoCircle,faPlusCircle,faPortrait,faAirFreshener,faGift,faArrowAltCircleRight,faThumbsUp) 

const Messenger = observer(() => {
  

  return (

    <div className="app">
        <div className="app-grid">
            <Header />
            <div className="container">
                <Conversation />
                <Switch>
                  <Route path="/messenger" exact component={ChatEmpty}/>
                  <Route path="/messenger/:conversationId" exact component={ContrainerMess}/>
                </ Switch>
                
            
            </div>

        
        </div>
    </div>
    
    // <>
    //  <Topbar />
    //   <div className="messenger">

    //     <div className="chatMenu">
    //       <div className="chatMenuWrapper">
            
    //         <div className="chatMenuWrapper-toolbar row">
    //           <div className="chatMenuWrapper-toolbar_room">
    //             <span>CHAT</span>
    //             <div>
    //               <img src="https://img.icons8.com/ios-glyphs/30/000000/ellipsis.png" className="imgCircle"/>
    //               <img src="https://img.icons8.com/ios-filled/30/000000/video.png" className="imgCircle"/>
    //               <img src="https://img.icons8.com/office/30/000000/note.png" className="imgCircle"/>
    //             </div>
    //           </div>

    //           <div className="chatMenuWrapper-toolbar_search">
    //             <img src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/15/000000/external-back-arrow-basic-ui-elements-flatart-icons-outline-flatarticons.png" className="chatMenuWrapper-toolbar_search_back" hidden={!startSearch} onClick={handleCancelSearch}/>
    //             <img src="https://img.icons8.com/ios-glyphs/15/000000/search--v1.png" hidden={startSearch}/>
    //             <input placeholder="Search for friends" className="chatMenuInput" onChange={handleSearchFriend} onClick={handleStartSearch} ref={ref}/>
    //           </div>
             
    //         </div>
           
    //        <div className="chatMenuWrapper-list">
    //         {startSearch ? _.isEmpty(listSearch) ? null : listSearch.map((user) => (
    //             <div onClick={() => setCurrentChatSearch(user)}>
    //               <Search user={user} />
    //             </div>
    //           ))
    //           :conversationss.map((c, index) => (
    //             <Link onClick={async () => {
    //               // setCurrentChat(c);
    //               currentLastText.current = index;
    //              await handleOutRoom(c);
    //              out_room.current = index;
    //             }
    //             }
    //             to={`/messenger/${c._id}`}>
    //               <Conversation conversation={c} currentUser={AuthStore.user} index={index} seen={c.lastText?.seens?true:false}/>
    //             </Link>
    //           ))}
    //        </div>
           
    //       </div>
    //     </div>

        
    //     <div className="chatBox">
    //       <div className="chatBoxWrapper">
    //           <Switch>
    //             <Route path="/messenger" exact component={ChatEmpty}/>
    //             <Route  path={`/messenger/:conversationId`}  exact component={ChatBox}/>

    //           </Switch>
    //       </div>
    //     </div>
    //     <div className="chatOnline" ref={showRef}>
    //       <div className="chatOnlineWrapper">

    //       </div>
    //     </div>
    //   </div> 
    //  </> 

      
    
  );
}) 

export default Messenger;
  
