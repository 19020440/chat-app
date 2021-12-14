import React, { useRef } from 'react';
import {Row, Col,Input} from 'antd';
import './gifphy.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
import _ from 'lodash';
library.add(fab,faSearch)
const  Gifphy = observer(({currentConversation,indexCov})  => {
    const AuthStore = useStore('AuthStore');
    const ActionStore = useStore('ActionStore');
    const {user} = AuthStore;
    const imageRef = useRef(null);
    const handleSearchGif = (e) => {
        AuthStore.action_getGifPhyList(e.target.value);
    }

    const handleSendGif = async (e) => {
        try {
            const statusSeen = currentConversation.lastText.seens;
            const seen = statusSeen.filter(value => value.seen == true && value.id != AuthStore.user._id);
            // const receiverId = currentConversation.members.find(
            //     (member) => member !== user._id
            // );

            const message = {
                sender: user._id,
                text: JSON.stringify([e.target.src]),
                conversationId: currentConversation?._id,
                seens: statusSeen,
                seen: !_.isEmpty(seen),
              };
              const res = await ActionStore.action_saveMessage(message);
              const {conversationId,...lastText} = message;
              if(indexCov !== null){
                ActionStore.action_setConverSationByIndex({updatedAt: Date(Date.now()),lastText}, indexCov);
              }
              AuthStore.action_setTextGif(res);
              AuthStore.socket?.emit("sendMessage", res);
           
        } catch(err) {
            console.log(err);
        }

    }
    return (
        <div className="gifphy_component">
            <Row>
                <Col span={22} offset = {1}>
                    <div className="gifphy_search">
                    <FontAwesomeIcon icon={faSearch} />
                    <Input placeholder="Tìm kiếm" onChange={handleSearchGif}/>
                    </div>
                </Col>
                {!_.isEmpty(AuthStore.GifphyList) && 
                    AuthStore.GifphyList.map((value) => {
                        return (
                            <Col span={24} className="gifphy_image" onClick={handleSendGif}>
                                <img src={value.images.fixed_height.url} />
                            </Col>
                        )
                    })
                
                
                
                }
               

                
            </Row>
        </div>
    );
})

export default Gifphy;