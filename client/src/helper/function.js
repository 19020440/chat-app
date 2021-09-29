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

  export const findObjectFromArrayLodash = (array, objectFind) => {
    return _.find(array, objectFind);

  };

  export const findIndexFromArrayLodash = (arr, obj) => {
    return  _.findIndex(arr, obj);
  }

  export const findIndexLastTextSeen = (data) => {
    if(_.size(data) >=1){
      for(let i = _.size(data)-1; i >=0;--i)   if(data[i].seens) return i;
      return null;
    }

    return null;
  }

  export const sortConversationByUpdateAt = (conversations) => {

    const result =  _.orderBy(conversations.slice(), [(obj) => new Date(obj.updatedAt)], ['desc'])
    console.log(result);
    return result;
  }
  
  export const countTextNotSeen = (conversations, userId) => {
    let count = 0;
    console.log(userId);
    try {
      conversations.map((value) => {
        if(value?.lastText?.seens === false && value.lastText?.sender != userId) count++;
      })
    } catch(err) {
      console.log(err);
    }
    
    return count;
  }