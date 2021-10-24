import React, { useEffect, useRef, useState } from 'react';
import './upload.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faXbox, faXing, faXingSquare } from '@fortawesome/free-brands-svg-icons'
import {} from '@fortawesome/free-solid-svg-icons'
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
library.add(fab,faXbox,faXingSquare) 
const Upload = observer(({file,cancel,indexs}) => {
    const [url, setUrl] = useState(null);
    const AuthStore = useStore('AuthStore')
    const [isImage,setIsImage] = useState(false);

    useEffect(() => {
        const arr = file.type.split('/');

        if(arr[1] == "png" || arr[1] == "jpeg") {
            let fileName = URL.createObjectURL(file);
            setUrl(fileName);
            setIsImage(true);
        }

        
    },[])

    const handleCancelImage = (e) => {
        cancel(indexs);
        AuthStore.action_setCancelImageIndex(indexs);
    }
    return (
        <div className="container_mess-uploadFile" >
            {isImage ?  
            <>
               <img 
               src="https://img.icons8.com/ios-glyphs/15/000000/macos-close.png" 
               className="Upload_cancel" 
               onClick={handleCancelImage}
               />
                
                <img src={url}/>
            </>
            : <span>{file.name}</span>
            
            }
            
        </div>
    );
})

export default Upload;