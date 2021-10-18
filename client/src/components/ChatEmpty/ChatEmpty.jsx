import React from 'react';
import StartMes from '../StartMess/StartMes'
import './chatempty.css'
import { Row, Col } from 'antd';
function ChatEmpty(props) {
    return (
        <Row className="chat_empty">
           <StartMes />
        </Row>
    );
}

export default ChatEmpty;