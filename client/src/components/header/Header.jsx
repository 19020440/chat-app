import React from 'react';
import './header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function header(props) {
    return (
        <header className="header">
                <div className="header-grid">
                    <div className="header-left">
                        <a href="./home.html">
                            <div className="header-left__logo">
                                <FontAwesomeIcon icon="fa-brands fa-facebook" className="header-left__icon-logo"/>
                            </div>
                        </a>
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

                        <div className="header-switch__box">
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
                            <img src="" alt="" className="header-profile__img avt" />
                            <span className="header-profile__name last-name">Hồ</span>
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
                        <li className="header-right__item">
                            {/* <i className="fas fa-caret-down header-right__item-caret-down"></i> */}
                            <FontAwesomeIcon icon="fa-solid fa-caret-down" className="header-right__item-caret-down"/>
                            <div className="header-right__item-more header-right__setting">
                                <div className="setting-head nav-wall">
                                    <img src="" alt="" className="avt setting-head__avatar" />
                                    <div className="setting-head__content">
                                        <p className="setting-head__content-name full-name">
                                            Lê Hồ
                                        </p>
                                        <p className="setting-head__content-note">
                                            Xem trang cá nhân của bạn
                                        </p>
                                    </div>
                                </div>
                                <div className="setting__respond">
                                    <div>
                                        <div className="setting__respond-img">
                                            <i className="fas fa-exclamation-circle"></i>
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
                                            <i className="fas fa-cogs"></i>
                                        </div>
                                        <p className="setting__item-content">
                                           {` Cài đặt & quyền riêng tư`}
                                        </p>
                                        <i className="fas fa-chevron-right"></i>
                                    </li>
                                    <li className="setting__item">
                                        <div className="setting__item-img">
                                            <i className="fas fa-question-circle"></i>
                                        </div>
                                        <p className="setting__item-content">
                                            {`Trợ giúp & hỗ trợ`}
                                        </p>
                                        <i className="fas fa-chevron-right"></i>
                                    </li>
                                    <li className="setting__item">
                                        <div className="setting__item-img">
                                            <i className="fas fa-moon"></i>
                                        </div>
                                        <p className="setting__item-content">
                                            {`Màn hình & trợ năng`}
                                        </p>
                                        <i className="fas fa-chevron-right"></i>
                                    </li>
                                    <li className="setting__item nav-logout">
                                        <a href="index.html">
                                            <div className="setting__item-img">
                                                <i className="fas fa-sign-out-alt"></i>
                                            </div>
                                            <p className="setting__item-content">
                                                    Đăng xuất
                                            </p>
                                        </a>
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
    );
}

export default header;