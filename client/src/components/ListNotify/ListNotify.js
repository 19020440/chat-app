import React, { useEffect, useState } from 'react';
import {useStore} from '../../hook'
import {observer} from 'mobx-react-lite'
const ListNotify = observer((props) => {
    const AuthStore = useStore('AuthStore');
    const [listNotify,setListNotify] = useState([]);
    useEffect(() => {
          //receive_notify
    AuthStore.socket.on('answer_invite_group', newNotify => {
        setListNotify(prev => [...prev,newNotify]);
    })
    },[])
    return (
        <div>
            
        </div>
    );
})

export default ListNotify;