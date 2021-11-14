import React, { useRef } from 'react';
import 'antd/dist/antd.css';
import { Row, Col } from 'antd';
import { Carousel } from 'antd';
import './startmess.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'


library.add(fab,faChevronLeft,faChevronRight) 

function StartMes(props) {
    const ref = useRef();

    const next = () => {
        ref.current.next();
      }
     const previous = () => {
        ref.current.prev();
      }
    return (
        <Col span={22} offset={1}>
            <Row>
                <Col span={8} offset={8} className="header_emptychat-container">
                    <h3>Chào mừng bạn đến với Social App</h3>
                    <p>Khám phá những tiện ích hỗ trợ và làm việc cùng người thân, bạn bè được tối ưu cho máy tính</p>
                </Col>

                <Col span={24} className="carousel_chat-container">
                    <FontAwesomeIcon icon={faChevronLeft} onClick={previous}/>
                    <Carousel autoplay className="carousel_chat" ref={ref}>
                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://i.doanhnhansaigon.vn/2018/11/12/bquytktthccucnichuyn-1541989826_1541989845_750x0.png"/>
                                <div style={{marginTop: "20px"}}>
                                    <h3 style={{color: "#2850e2"}}>Nhắn tin nhiều hơn, soạn thảo ít hơn</h3>
                                    <p>Sử dụng các tin nhắn nhanh để lưu sẵn các tin nhắn thường dùng và gửi nhanh chóng trong hội thoại bất kì</p>
                                </div>
                            </Col>
                        </Row>

                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://media.istockphoto.com/vectors/children-video-call-small-girls-communicating-via-video-chat-during-vector-id1226047261"/>
                                <div style={{marginTop: "20px"}}>
                                    <h3 style={{color: "#2850e2"}}>Gọi nhóm và làm việc hiệu quả</h3>
                                    <p>Trao đổi công việc mọi lúc mọi nơi</p>
                                </div>
                            </Col>
                        </Row>
                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://blogcuatoi.net/wp-content/uploads/2020/03/cach-gui-file-qua-mail-tren-may-tinh-300x185.jpg"/>
                                <div style={{marginTop: "20px"}}>
                                    <h3 style={{color: "#2850e2"}}>Trải nghiệm xuyên suốt</h3>
                                    <p>Kết nối và giải quyết công việc trên mọi thiết bị với dự liệu luôn đồng bộ </p>
                                </div>
                            </Col>
                        </Row>
                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-images/922b4050245c11e9b0a60d1395754de5.jpg"/>
                                <div style={{marginTop: "20px"}}>
                                    <h3 style={{color: "#2850e2"}}>Giải quyết công việc hiệu quả hơn</h3>
                                    <p>Với Social-App</p>
                                </div>
                            </Col>
                        </Row>
                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ8gcNEthpJgp-kY48oJdhhRz5WukYaVhh2A&usqp=CAU"/>
                                <div style={{marginTop: "20px"}}>
                                    <h3 style={{color: "#2850e2"}}>Chat nhom với đồng nghiệp</h3>
                                    <p>Tiện lợi hơn, nhờ công cụ chat trên máy tính</p>
                                </div>
                            </Col>
                        </Row>
                      
                    </Carousel>
                    <FontAwesomeIcon icon={faChevronRight} onClick={next}/>
                </Col>
               
            </Row>
            
        </Col>
    );
}

export default StartMes;