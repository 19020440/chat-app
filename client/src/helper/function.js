import {Modal, message} from 'antd'
import _ from 'lodash';
import moment from 'moment';
export const showMessageError = (msg, onOk) => {
    Modal.error({
      content: msg,
      onOk: onOk || null,
    });
  };

  
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
      for(let i = _.size(data)-1; i >=0;--i)   if(data[i].seen) return i;
      return null;
    }

    return null;
  }

  export const sortConversationByUpdateAt = (conversations) => {

    const result =  _.orderBy(conversations.slice(), [(obj) => new Date(obj.updatedAt)], ['desc'])
    return result;
  }
  export const sortNotify = (notify) => {
    const result  = notify.sort((a,b) =>  moment(b.createdAt).unix() - moment(a.createdAt).unix())
    return result;
  }
  
  export const countTextNotSeen = (conversations, userId) => {
    let count = 0;
    try {
      conversations.map((value) => {
        if(value.lastText.sender != userId) {
          value.lastText.seens.map(user => {
            if(user.id == userId && !user.seen) count++;
          })
        }
        
      })
    } catch(err) {
      console.log(err);
    }
    
    return count;
  }

  export const findMessenger = (data,string) => {
    const result  = data.map((value,index) => {
      if(value.text.indexOf(string) != -1 && !_.isArray(JSON.parse(value.text))) return index;
    })
    const rs = result.filter(value => value != undefined)
    return rs;
  }

  export const addSpantoText = (string,find) => {
    let re = new RegExp(find, 'g');
    string = string.replace(re, `<span class="hight_light-text">${find}</span>`);
    return string;
  }

  export const deleteItemInArrayByIndex = (arr,index) => {
    arr.splice(index,1);
    console.log(arr);
    return arr;
  }

  export const ValidateListFriend = (userId, listFriend) => {
    const result =  listFriend.filter(value => value == userId);
    if(!_.isEmpty(result))  return true;
    return false;
  }

  export const searchSendMess = (data, text) => {
    try {
      return data.filter(items => {
        return items?.username.toLowerCase().indexOf(text) != -1 
      })
    } catch (er) {
      console.log(er);
    }
   
  }

  export const FilterTypeConversation = (data, type) => {
    if(type == 1) return data;
    else if(type == 2) {
      return data.filter(items => !items?.name)
    } else return data.filter(item => item?.name);
  }