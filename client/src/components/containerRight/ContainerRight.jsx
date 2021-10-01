import React from 'react';

function ContainerRight(props) {
    return (
        <>
        <div class="container-right">
                    <div class="container-right__head">
                        <div class="container-right__head-avt">
                            <img src="./assets/img/avatar-nam.jpg" alt="" class="container-right__head-avt-img avt-mess" />
                        </div>
                        <div class="container-right__head-info">
                            <div class="container-right__head-name name-mess">
                                User
                            </div>
                            <div class="container-right__head-time online">
                                Text
                            </div>
                        </div>
                    </div>
                    <div class="container-right__menu">
                        <div class="container-right__menu-dropdown">
                            <div class="dropdown-head">
                                <div class="dropdown-head__title">
                                    Tuỳ chỉnh đoạn chat
                                </div>
                                <div class="dropdown-head__icon">
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
                            <ul class="dropdown-list">
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <i  class="fas fa-dot-circle"></i>
                                    </div>
                                    <div class="dropdown-item__text">
                                        Đổi chủ đề
                                    </div>
                                </li>
                                
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <i class="fas fa-thumbs-up"></i>
                                    </div>
                                    <div class="dropdown-item__text">
                                        Thay đổi biểu tượng cảm xúc
                                    </div>
                                </li>
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <i class="far fa-font-case"></i>
                                    </div>
                                    <div class="dropdown-item__text">
                                        Chỉnh sửa biệt danh
                                    </div>
                                </li>
                                <li class="dropdown-item">
                                    <div class="dropdown-item__icon">
                                        <i class="fal fa-search"></i>
                                    </div>
                                    <div class="dropdown-item__text">
                                        Tìm kiếm trong cuộc trò chuyện
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="container-right__menu-dropdown">
                            <div class="dropdown-head">
                                <div class="dropdown-head__title">
                                    {`Quyền riêng tư & hỗ trợ`}
                                </div>
                                <div class="dropdown-head__icon">
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                        <div class="container-right__menu-dropdown">
                            <div class="dropdown-head">
                                <div class="dropdown-head__title">
                                    Tệp được chia sẻ
                                </div>
                                <div class="dropdown-head__icon">
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                        <div class="container-right__menu-dropdown">
                            <div class="dropdown-head">
                                <div class="dropdown-head__title">
                                    File phương tiện được chia sẻ
                                </div>
                                <div class="dropdown-head__icon">
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ContainerRight />
                </>
    );
}

export default ContainerRight;