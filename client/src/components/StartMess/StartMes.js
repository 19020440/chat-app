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
                    <h3>Chào mừng bạn đến với Wilina</h3>
                    <p>Khám phá những tiện ích hỗ trợ và làm việc cùng người thân, bạn bè được tối ưu cho máy tính</p>
                </Col>

                <Col span={24} className="carousel_chat-container">
                    <FontAwesomeIcon icon={faChevronLeft} onClick={previous}/>
                    <Carousel autoplay className="carousel_chat" ref={ref}>
                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://phunugioi.com/wp-content/uploads/2020/04/anh-gai-xinh-2k-de-thuong-cute.jpg"/>
                                <div>
                                    <h3>Khám phá trải nghiệm</h3>
                                    <p>Khám phá những tiện ích hỗ trợ và làm việc cùng người thân, bạn bè được tối ưu cho máy tính</p>
                                </div>
                            </Col>
                        </Row>

                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://phunugioi.com/wp-content/uploads/2020/04/anh-gai-xinh-2k-de-thuong-cute.jpg"/>
                                <div>
                                    <h3>Khám phá trải nghiệm</h3>
                                    <p>Khám phá những tiện ích hỗ trợ và làm việc cùng người thân, bạn bè được tối ưu cho máy tính</p>
                                </div>
                            </Col>
                        </Row>
                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://phunugioi.com/wp-content/uploads/2020/04/anh-gai-xinh-2k-de-thuong-cute.jpg"/>
                                <div>
                                    <h3>Khám phá trải nghiệm</h3>
                                    <p>Khám phá những tiện ích hỗ trợ và làm việc cùng người thân, bạn bè được tối ưu cho máy tính</p>
                                </div>
                            </Col>
                        </Row>
                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://phunugioi.com/wp-content/uploads/2020/04/anh-gai-xinh-2k-de-thuong-cute.jpg"/>
                                <div>
                                    <h3>Khám phá trải nghiệm</h3>
                                    <p>Khám phá những tiện ích hỗ trợ và làm việc cùng người thân, bạn bè được tối ưu cho máy tính</p>
                                </div>
                            </Col>
                        </Row>
                        <Row> 
                            <Col span={8} offset={8} className="content_chatempty">
                                <img src="https://phunugioi.com/wp-content/uploads/2020/04/anh-gai-xinh-2k-de-thuong-cute.jpg"/>
                                <div>
                                    <h3>Khám phá trải nghiệm</h3>
                                    <p>Khám phá những tiện ích hỗ trợ và làm việc cùng người thân, bạn bè được tối ưu cho máy tính</p>
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