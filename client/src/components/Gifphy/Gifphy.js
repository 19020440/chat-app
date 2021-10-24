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
const  Gifphy = observer(({currentConversation})  => {
    const AuthStore = useStore('AuthStore');
    const ActionStore = useStore('ActionStore');
    const {user} = AuthStore;
    const imageRef = useRef(null);
    const handleSearchGif = (e) => {
        if(e.which == 13) AuthStore.action_getGifPhyList(e.target.value);
    }

    const handleSendGif = async (e) => {
        try {
            const statusSeen = currentConversation?.lastText?.receiveSeen ? true:false;
            const receiverId = currentConversation.members.find(
                (member) => member !== user._id
            );

            const message = {
                sender: user._id,
                text: JSON.stringify([e.target.src]),
                conversationId: currentConversation?._id,
                seens: statusSeen,
              };
              const res = await ActionStore.action_saveMessage(message);
              AuthStore.action_setTextGif(res);
              AuthStore.socket?.emit("sendMessage", {
                senderId: user._id,
                receiverId,
                text: JSON.stringify([e.target.src]),
                updatedAt: Date.now(),
                conversationId: currentConversation?._id,
                seens: statusSeen,
            });
           
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
                    <Input placeholder="Basic usage" onKeyPress={handleSearchGif}/>
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