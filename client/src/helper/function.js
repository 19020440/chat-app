import {Modal, message} from 'antd'
import _ from 'lodash';
export const showMessageError = (msg, onOk) => {
    Modal.error({
      content: msg,
      onOk: onOk || null,
    });
  };
  
//   export const showModalTimeOut = (msg, onOk) => {
//     Modal.error({
//       icon: null,
//       content: <TimeOut onOk={onOk} msg={msg} />,
//       className: "modalLogout",
//       width: 1000,
//       okButtonProps: {
//       },
//     });
//   };
  
  export const showMessageSuccess = (msg, onOk) => {
    Modal.success({
      content: msg,
      onOk: onOk || null,
    });
  };
  
  export const showMessageInfo = (msg) => {
    message.info(msg);
  };

  export const getLessProfile = (data) => {
    if(_.isEmpty(data)) return [];
    const result = data.map((value) => {
      const {isAdmin,status,password,...resData} = value;
      return resData;
    })
    return result;
  }