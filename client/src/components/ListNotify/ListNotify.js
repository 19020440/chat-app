import React, { useEffect, useState } from 'react';
import {useStore} from '../../hook'
import {observer} from 'mobx-react-lite'
import {Row, Col, Image} from 'antd';
const ListNotify = observer((props) => {
    const AuthStore = useStore('AuthStore');
    const [listNotify,setListNotify] = useState([]);
    useEffect(() => {
          //receive_notify
    AuthStore.socket.on('invite_to_group', ({name, user}) => {
        setListNotify(prev => [...prev,{profilePicture: user?.profilePicture, des: `${user.username} đã mời bạn vào nhóm ${name}`}]);
    })

    AuthStore.socket.on("invite_success", ({username, profilePicture}) => {
        setListNotify(prev => [...prev,{profilePicture, des: `${username} đã kết bạn với bạn`}])
    })
    },[])
    return (
        <Row>
            {listNotify.map(value => {
                return (
                    <Col span={24}>
                        <Row justify="space-between">
                            <Col span={3}>
                                <Image src={value.profilePicture} preview={false}/>
                            </Col>
                            <Col span={20}> 
                                {value.des}
                            </Col>
                        </Row>
                    </Col>
                )
            })}
        </Row>
    );
})

export default ListNotify;