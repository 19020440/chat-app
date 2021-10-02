import React, {useState, useRef} from 'react';
import './header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {observer} from 'mobx-react-lite'
import {useStore} from '../../hook'
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import _ from 'lodash'
import {Modal} from 'antd'
import { faChevronRight, faCog, faExclamation, faGem, faMoon, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add( fab, faExclamation, faCog, faQuestionCircle, faMoon, faSignOutAlt,faChevronRight,faFacebookMessenger) 
const header = observer((props) => {
    const AuthStore = useStore('AuthStore');
    const {user} = AuthStore;
    const [visible, setVisible] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const ref = useRef(null);
    const [action, set_action] = useState(true);
    const handleTheme = async () => {
        
        await AuthStore.action_setTheme();
        // set_action(!action);
    }
    const handleLogOut = async () => {
        !_.isEmpty(AuthStore.socket) && AuthStore.socket.emit("userOffline", AuthStore.user._id);
        
        await AuthStore.action_logout();
        setVisible(false); 
      }
    
      const handleCancel = () => {
        setVisible(false); 
      }

      const showModal = () => {
        setVisible(true); 
      }

      const handleSetting = async (e) => {
        const element = ref.current.getAttribute("class");
        if(element.indexOf("hidden") != -1) {
          ref.current.classList.remove("hidden");
        } else ref.current.classList.add("hidden");
        
      }
    return (
        <>
        <header className="header">
                <div className="header-grid">
                    <div className="header-left">
                        <Link to="/">
                            <div className="header-left__logo">
                                <FontAwesomeIcon icon="fa-brands fa-facebook" className="header-left__icon-logo"/>
                            </div>
                        </Link>
                        <div className="header-left__search">
                            <div className="header-left__search-icon">
                                <i className="fal fa-search"></i>
                            </div>
                            <input type="text" id="search-input" className="header-left__search-input" placeholder="Tìm kiếm trên Facebook" />
                            <ul className="header-left__search-history">
                                <li className="header-left__search-history-item">
                                    Không có tìm kiếm nào gần đây
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* <ul className="header-main">
                        <li className="header-main__item home-btn active nav-home">
                            <i className="fas fa-home"></i>
                            <span className="header-main__item-title">Trang chủ</span>
                        </li>
                        <li className="header-main__item">
                            <i className="fas fa-user-friends"></i>
                            <span className="header-main__item-title">Nhóm</span>
                        </li>
                        <li className="header-main__item">
                            <i className="fas fa-gamepad"></i>
                            <span className="header-main__item-title">Trò chơi</span>
                        </li>
                        <li className="header-main__item nav-left-layout">
                            <i className="fas fa-bars"></i>
                            <span className="header-main__item-title">Khác</span>
                        </li>
                    </ul>  */}

                    <div className="header-switch switch-mode-mess">

                        <div className={`header-switch__box${AuthStore.themePage? "":" dark"}`} onClick={handleTheme}>
                            <div  className="header-switch-icon switch-moon">
                            <FontAwesomeIcon icon="fa-solid fa-moon" />
                            </div>
                            <div className="header-switch-icon switch-sun">
                            <FontAwesomeIcon icon="fa-solid fa-sun" />
                            </div>
                        </div>
                        
                    </div>

                    <ul className="header-right">
                        <li className="header-right__profile nav-wall">
                            <img src={
                                    user?.profilePicture
                                        ? user?.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" className="header-profile__img avt" />
                            <span className="header-profile__name last-name">{user?.username}</span>
                        </li>

                        <li className="header-right__item">
                            <span className="header-right__item-count">
                                1
                            </span>
                            <FontAwesomeIcon icon={faFacebookMessenger} className="header-right__item-notify"/>
                        </li>
                        
                        <li className="header-right__item">
                            <span className="header-right__item-count">
                                1
                            </span>
                            {/* <i className="fas fa-bell header-right__item-notify"></i> */}
                            <FontAwesomeIcon icon="fa-solid fa-bell" className="header-right__item-notify"/>
                            <div className="header-right__item-more header-right__notify">
                                <div className="notify-heading">
                                    <h2 className="notify-heading__text">
                                        Thông báo
                                    </h2>
                                    <div className="notify-heading__right">
                                        <div className="notify-heading__right-icon">
                                            {/* <i className="fas fa-ellipsis-h"></i> */}
                                            <FontAwesomeIcon icon="fa-solid fa-eclipse" />
                                        </div>
                                    </div>
                                </div>
                                <div className="notify-content">
                                    <div className="notify-content__new">
                                        <div className="notify-content__new-head">
                                            <p className="notify-content__head-text new-notify__title">
                                                Mới
                                            </p>
                                            <ul className="notify-content__new-list">
                                                
                                            </ul>
                                            <p className="notify-content__head-text">
                                                Trước đó
                                            </p>
                                            <ul className="notify-content__before-list">
                                                
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="header-right__item" onClick={handleSetting}>
                            {/* <i className="fas fa-caret-down header-right__item-caret-down"></i> */}
                            <FontAwesomeIcon icon="fa-solid fa-caret-down" className="header-right__item-caret-down"/>
                            <div className="header-right__item-more header-right__setting" ref={ref}>
                                <div className="setting-head nav-wall">
                                    <img src={
                                    user?.profilePicture
                                        ? user?.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" className="avt setting-head__avatar" />
                                    <div className="setting-head__content">
                                        <p className="setting-head__content-name full-name">
                                            {user?.username}
                                        </p>
                                        <p className="setting-head__content-note">
                                            Xem trang cá nhân của bạn
                                        </p>
                                    </div>
                                </div>
                                <div className="setting__respond">
                                    <div>
                                        <div className="setting__respond-img">
                                        <FontAwesomeIcon icon="fa-solid fa-exclamation" />
                                            {/* faExclamation */}
                                        </div>
                                        <div className="setting__respond-content">
                                            <p className="setting__respond-title">
                                                Đóng góp ý kiến
                                            </p>
                                            <p className="setting__respond-note">
                                                Góp phần cải thiện Facebook mới.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <ul className="setting__list">
                                    <li className="setting__item">
                                        <div className="setting__item-img">
                                            <FontAwesomeIcon icon={faCog} />
                                        </div>
                                        <p className="setting__item-content">
                                           {` Cài đặt & quyền riêng tư`}
                                        </p>
                                        
                                    </li>
                                    <li className="setting__item">
                                        <div className="setting__item-img">
                                            <FontAwesomeIcon icon={faQuestionCircle} />
                                        </div>
                                        <p className="setting__item-content">
                                            {`Trợ giúp & hỗ trợ`}
                                        </p>
                                        
                                    </li>
                                    <li className="setting__item">
                                        <div className="setting__item-img">
                                            <FontAwesomeIcon icon={faMoon} />
                                        </div>
                                        <p className="setting__item-content">
                                            {`Màn hình & trợ năng`}
                                        </p>
                                        
                                    </li>
                                    <li className="setting__item nav-logout" onClick={showModal }>

                                            <div className="setting__item-img">
                                             <FontAwesomeIcon icon={faSignOutAlt} />
                                            </div>
                                            <p className="setting__item-content">
                                                    Đăng xuất
                                            </p>

                                    </li>
                                </ul>
                                <footer className="setting__footer">
                                    <span>
                                        Quyền riêng tư
                                    </span>
                                    ·
                                    <span>
                                        Điều khoản
                                    </span>
                                    · 
                                    <span>
                                        Quảng cáo
                                    </span>   
                                    ·
                                    <span>
                                        Cookie
                                    </span>   
                                    · 
                                    <span>
                                        Chính sách
                                    </span> 
                                    · 
                                    Facebook © 2021
                                </footer>
                            </div>
                        </li>
                    </ul>
                </div>

                
            </header>
            <Modal
                title="Bạn có chắc muốn thoát!"
                visible={visible}
                onOk={handleLogOut}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
                >
            </Modal>
            </>
    );
});

export default header;