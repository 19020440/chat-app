import React, { useRef, useState } from 'react';
import './containerRight.css'
import {observer} from 'mobx-react-lite'
import _ from 'lodash'
import {useStore} from '../../hook'
import { useHistory, useParams } from 'react-router';
import { Modal,Row,Col,Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faChevronUp, faBell, faChevronDown, faBan, faUserSlash, faDotCircle, faThumbsUp, faFont, faSearch, faWrench, faCheck, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faChevronDown, faChevronUp,faBell,faUserSlash,faWrench,faCheck,faSignOutAlt) 
const ContainerRight = observer(({infoRoom,members}) => {
    const AuthStore = useStore('AuthStore')
    const ActionStore = useStore('ActionStore')
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [activeQVR, setActiveQVR] = useState(false);
    const [active, setActive] = useState(false);
    const [editNameStatus,setEditNameStatus] = useState(false);
    const [reNameGroup,setReNameGroup] = useState(false);
    const [leaveGroup,setLeaveGroup] = useState(false);
    const {conversationId} = useParams(); 
    const history = useHistory();
    const handleShow = () => {
        setActive(!active);
    }
    const handleShowQVR = () => {
        setActiveQVR(!activeQVR);
    }

    const handleSearchMess = () => {
        AuthStore.action_searchMess(true);
    }
    //EDIT_Name_Modal
    const editName = (isModalVisible) => {
        
        return (
            <Modal title="Chỉnh sửa biệt danh" visible={isModalVisible}  onCancel={handleCancelEditNameModal} className="modal-edit_name">
                <Row>
                    {!_.isEmpty(members) && members.map(value => {
                        return (
                            <Col span={24} className="modal-edit-profile">
                                <div className="modal-profile-fix">
                                    <img src={value.profilePicture} alt="" />
                                    <input disabled placeholder={value.username} onChange={(e) => {
                                        // e.target.value = e.which
                                        e.target.placeholder = e.target.value
                                    }}/>
                                </div>
                                <img src="https://img.icons8.com/pastel-glyph/35/000000/edit--v1.png" 
                                    onClick={(e) => {
                                        const input = e.target.previousElementSibling.children[1];
                                        const check = e.target.nextElementSibling;
                                        check.hidden = false;
                                        input.style.border = "2px #8a8ad8 solid"
                                        e.target.hidden = true;
                                        input.disabled = false;
                                       
                                    }}
                                
                                />
                                <img src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/35/000000/external-check-basic-ui-elements-flatart-icons-outline-flatarticons.png" hidden
                                    onClick={(e) => {
                                        const input = e.target.previousElementSibling.previousElementSibling.children[1];
                                        const edit = e.target.previousElementSibling;
                                        const check = e.target;
                                        check.hidden = true;
                                        input.style.border = "none"
                                        edit.hidden = false;
                                        input.disabled = true;
                                        value.username = input.placeholder
                                        ActionStore.action_changePropertyConversation("members",conversationId,members);
                                    }}
                                />
                            </Col>
                        )
                    })}
                </Row>
        
            </Modal>
        )
    }
    //Rename-chat
    const ModalRename = (isModalVisible) => {
        return (
            <Modal title="Đổi tên đoạn chat" visible={isModalVisible}  
                onCancel={handleCancelReName} 
                onOk={handleAcceptReName}
                okText="Lưu"
                cancelText="Hủy"
                // okButtonProps={{disabled: true}}
            >
                <Row>
                    <Col span={24}>
                        <Input placeholder={infoRoom.username} onChange={(e) => {
                            infoRoom.username = e.target.value;
                        }}/>
                    </Col>
                </Row>
    
            </Modal>
        )
    }

    const LeaveGroupModal = (isModalVisible) => {
        return (
            <Modal title="Bạn có chắc muốn rời khỏi cuộc trò chuyện này" visible={isModalVisible}  
                onCancel={handleCancelLeaveGroup} 
                onOk={handleLeaveGroup}
                okText="Có"
                cancelText="Hủy"
            >
            </Modal>
        )
    }
    const handleCancelLeaveGroup = () => {
        setLeaveGroup(false);
    }
    const handleLeaveGroup =(e) => {
        ActionStore.action_changePropertyConversation('leave',conversationId);
        history.push('/messenger')
    }   
     
    const handleCancelReName = () => {
        setReNameGroup(false);
    }
    const handleAcceptReName = (e) => {
       
        ActionStore.action_changePropertyConversation("name",conversationId,infoRoom.username);
        
        
    }
    const handleCancelEditNameModal = () => {
        setEditNameStatus(false);
    }
    
    return (
        <>
        <div className={`container-right${AuthStore.activeContainer?" active":""}`}>
                    <div className="container-right__head">
                        <div className="container-right__head-avt">
                            <img src={
                                    infoRoom?.profilePicture
                                        ? infoRoom?.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" className="container-right__head-avt-img avt-mess" />
                        </div>
                        <div className="container-right__head-info">
                            <div className="container-right__head-name name-mess">
                                {infoRoom?.username}
                            </div>
                            <div className="container-right__head-time online">
                                {infoRoom?.status?"Đang hoạt động":"Không hoạt động"}
                            </div>
                        </div>
                    </div>
                    <div className="container-right__menu">
                        <div className="container-right__menu-dropdown" >
                            <div className="dropdown-head" onClick={handleShow}>
                                <div className="dropdown-head__title">
                                    Tuỳ chỉnh đoạn chat
                                </div>
                                <div className="dropdown-head__icon" hidden={active}>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                                <div className="dropdown-head__icon" hidden={!active}>
                                    <FontAwesomeIcon icon={faChevronUp} />
                                </div>
                            </div>
                            <ul className={`dropdown-list${active? " active": ""}`}>
                                    {infoRoom.isGroup && 
                                         <li className="dropdown-item dropdown-item-rename" onClick={() => {
                                            setReNameGroup(true);
                                        }}>
                                            <div className="dropdown-item__icon">
                                                <img src="https://img.icons8.com/pastel-glyph/18/000000/edit--v1.png"/>
                                            </div>
                                            <div className="dropdown-item__text">
                                                Đổi tên đoạn chat
                                            </div>
                                        </li>
                                    }
                               


                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faDotCircle} />
                                    </div>
                                    <div className="dropdown-item__text">
                                        Đổi chủ đề
                                    </div>
                                </li>

                               
                                
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </div>
                                    <div className="dropdown-item__text">
                                        Thay đổi biểu tượng cảm xúc
                                    </div>
                                </li>
                                <li className="dropdown-item" onClick={() => setEditNameStatus(true)}>
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faFont} />
                                    </div>
                                    <div className="dropdown-item__text">
                                        Chỉnh sửa biệt danh
                                    </div>
                                </li>
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </div>
                                    <div className="dropdown-item__text" onClick={handleSearchMess}>
                                        Tìm kiếm trong cuộc trò chuyện
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="container-right__menu-dropdown" onClick={handleShowQVR}>
                            <div className="dropdown-head">
                                <div className="dropdown-head__title">
                                    {`Quyền riêng tư & hỗ trợ`}
                                </div>
                                <div className="dropdown-head__icon">
                                    <FontAwesomeIcon icon={faChevronDown} hidden={activeQVR}/>
                                </div>
                                <div className="dropdown-head__icon"  hidden={!activeQVR}>
                                    <FontAwesomeIcon icon={faChevronUp}/>
                                </div>
                            </div>
                            <ul className={`dropdown-list${activeQVR? " activeQVR": ""}`}>
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faBell}/>
                                    </div>
                                    <div className="dropdown-item__text">
                                        Tắt âm cuộc trò chuyện
                                    </div>
                                </li>
                                
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faBan}/>
                                    </div>
                                    <div className="dropdown-item__text">
                                        Bỏ qua tin nhắn
                                    </div>
                                </li>
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faUserSlash}/>
                                    </div>
                                    <div className="dropdown-item__text">
                                        Chặn
                                    </div>
                                </li>
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <i className="fal fa-search"></i>
                                    </div>
                                    <div className="dropdown-item__text">
                                        Có gì đó không ổn 
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="container-right__menu-dropdown">
                            <div className="dropdown-head">
                                <div className="dropdown-head__title">
                                    Tệp được chia sẻ
                                </div>
                                <div className="dropdown-head__icon">
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                        </div>
                        <div className="container-right__menu-dropdown">
                            <div className="dropdown-head">
                                <div className="dropdown-head__title">
                                    File phương tiện được chia sẻ
                                </div>
                                <div className="dropdown-head__icon">
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                        </div>
                        {infoRoom.isGroup && 
                            <div className="container-right__menu-dropdown right-bar-out_room" onClick={() => {
                                setLeaveGroup(true);
                            }}>
                                <div className="dropdown-head">
                                    <div className="dropdown-head__title">
                                    <FontAwesomeIcon icon={faSignOutAlt} /> Rời khỏi nhóm
                                    </div>
                                </div>
                            </div>
                        }
                       

                    </div>
                </div>
                {editName(editNameStatus)}
                {ModalRename(reNameGroup)}
                {LeaveGroupModal(leaveGroup)}
                </>
    );
})

export default ContainerRight;