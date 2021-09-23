import React from 'react';
import {Spin} from 'antd';
function Loading(props) {
    return (
        <Spin Loading={props.isLoading}/>
    );
}

export default Loading;