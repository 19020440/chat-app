import React, { useRef, useState } from 'react';
import './searchmess.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faSearch, faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';
import {observer} from 'mobx-react-lite'
import { useStore } from '../../hook';
import {findMessenger} from '../../helper/function'

library.add(fab,faSearch,faChevronDown,faChevronUp) 

const SearchMess = observer((props) => {
    const AuthStore = useStore('AuthStore');
    const ActionStore  = useStore('ActionStore');
    const [listSeaerchMess,setListSearchMess] = useState([]);
    const [index,setIndex] = useState();
    const handleClose = () => {
        AuthStore.action_searchMess(false);
        AuthStore.action_setStt(null);
    }

    const handleUp = () => {
        if(index > 0) {
            setIndex(index-1);
            AuthStore.action_setStt(listSeaerchMess[index-1]);
        } else {
            setIndex(listSeaerchMess.length-1);
            AuthStore.action_setStt(listSeaerchMess[listSeaerchMess.length-1]);
        }
     
    }

    const handleDown = () => {
        if(index < listSeaerchMess.length-1) {
            setIndex(index+1);
            AuthStore.action_setStt(listSeaerchMess[index+1]);
        } else {
            setIndex(0);
            AuthStore.action_setStt(listSeaerchMess[0]);
        }
        
    }

    const handleStartSearch = async (e) => {
        if(e.which  == 13) {
           await AuthStore.action_setStt(null);
            const result = findMessenger(ActionStore.listMess,e.target.value);
            if(_.size(result) == 0) {
                e.target.placeholder = "Không tìm thấy kết quả phù hợp";
                e.target.value = "";
                setListSearchMess([]);
            } else {
                AuthStore.action_setStt(result[result.length-1]);
                AuthStore.action_setTextSearch(e.target.value);
                setIndex(result.length-1)
                setListSearchMess(result);
            }
            
        }
    }
    return (
        <div className="container-main__head-searchMess">
            <div className="container-main__head-searchMess-input">
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" 
                className="container-left__search-box-input" 
                onKeyPress={handleStartSearch}
                />
            </div>
            
            <div className="container-main__head-searchMess-content">
                {!_.isEmpty(listSeaerchMess) && 
                    <>
                        <span>{index+1}</span>
                        <span>/{listSeaerchMess.length}</span>
                    </>
                    
                }
                <FontAwesomeIcon icon={faChevronUp} onClick={handleUp}/>
                <FontAwesomeIcon icon={faChevronDown} onClick={handleDown}/>
                <span onClick={handleClose}>Đóng</span>
            </div>
            
        </div>
    );
});

export default SearchMess;