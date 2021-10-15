import React, { useRef, useState } from 'react';
import {observer} from 'mobx-react-lite'
import {useStore} from '../../hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faChevronUp, faBell, faChevronDown, faBan, faUserSlash, faDotCircle, faThumbsUp, faFont, faSearch } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faChevronDown, faChevronUp,faBell,faUserSlash) 
const ContainerRight = observer((props) => {
    const AuthStore = useStore('AuthStore')
    const ActionStore = useStore('ActionStore')
    const {profileOfFriend} = ActionStore;
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [activeQVR, setActiveQVR] = useState(false);
    const [active, setActive] = useState(false);
    const handleShow = () => {
        setActive(!active);
    }
    const handleShowQVR = () => {
        setActiveQVR(!activeQVR);
    }
    return (
        <>
        <div class={`container-right${AuthStore.activeContainer?" active":""}`}>
                    <div class="container-right__head">
                        <div class="container-right__head-avt">
                            <img src={
                                    profileOfFriend?.profilePicture
                                        ? profileOfFriend?.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" class="container-right__head-avt-img avt-mess" />
                        </div>
                        <div class="container-right__head-info">
                            <div class="container-right__head-name name-mess">
                                {profileOfFriend?.username}
                            </div>
                            <div class="container-right__head-time online">
                                {profileOfFriend?.status?"Đang hoạt động":"Không hoạt động"}
                            </div>
                        </div>
                    </div>
                    <div class="container-right__menu">
                        <div class="container-right__menu-dropdown" onClick={handleShow}>
                            <div class="dropdown-head">
                                <div class="dropdown-head__title">
                                    Tuỳ chỉnh đoạn chat
                                </div>
                                <div class="dropdown-head__icon" hidden={active}>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                                <div class="dropdown-head__icon" hidden={!active}>
                                    <FontAwesomeIcon icon={faChevronUp} />
                                </div>
                            </div>
                            <ul class={`dropdown-list${active? " active": ""}`}>
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faDotCircle} />
                                    </div>
                                    <div class="dropdown-item__text">
                                        Đổi chủ đề
                                    </div>
                                </li>
                                
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </div>
                                    <div class="dropdown-item__text">
                                        Thay đổi biểu tượng cảm xúc
                                    </div>
                                </li>
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faFont} />
                                    </div>
                                    <div class="dropdown-item__text">
                                        Chỉnh sửa biệt danh
                                    </div>
                                </li>
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </div>
                                    <div class="dropdown-item__text">
                                        Tìm kiếm trong cuộc trò chuyện
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="container-right__menu-dropdown" onClick={handleShowQVR}>
                            <div class="dropdown-head">
                                <div class="dropdown-head__title">
                                    {`Quyền riêng tư & hỗ trợ`}
                                </div>
                                <div class="dropdown-head__icon">
                                    <FontAwesomeIcon icon={faChevronDown} hidden={activeQVR}/>
                                </div>
                                <div class="dropdown-head__icon"  hidden={!activeQVR}>
                                    <FontAwesomeIcon icon={faChevronUp}/>
                                </div>
                            </div>
                            <ul class={`dropdown-list${activeQVR? " activeQVR": ""}`}>
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faBell}/>
                                    </div>
                                    <div class="dropdown-item__text">
                                        Tắt âm cuộc trò chuyện
                                    </div>
                                </li>
                                
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faBan}/>
                                    </div>
                                    <div class="dropdown-item__text">
                                        Bỏ qua tin nhắn
                                    </div>
                                </li>
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faUserSlash}/>
                                    </div>
                                    <div class="dropdown-item__text">
                                        Chặn
                                    </div>
                                </li>
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <i class="fal fa-search"></i>
                                    </div>
                                    <div class="dropdown-item__text">
                                        Có gì đó không ổn 
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="container-right__menu-dropdown">
                            <div class="dropdown-head">
                                <div class="dropdown-head__title">
                                    Tệp được chia sẻ
                                </div>
                                <div class="dropdown-head__icon">
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                        </div>
                        <div class="container-right__menu-dropdown">
                            <div class="dropdown-head">
                                <div class="dropdown-head__title">
                                    File phương tiện được chia sẻ
                                </div>
                                <div class="dropdown-head__icon">
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>
    );
})

export default ContainerRight;