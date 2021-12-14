import React, { useEffect, useRef, useState } from 'react';
import './upload.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faXbox, faXing, faXingSquare } from '@fortawesome/free-brands-svg-icons'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import {useStore} from '../../hook';
import {observer} from 'mobx-react-lite'
library.add(fab,faXbox,faXingSquare,faFile) 
const Upload = observer(({file,cancel,indexs}) => {
    const AuthStore = useStore('AuthStore')
    const [isImage,setIsImage] = useState(false);

    useEffect(() => {
        const arr = file.type.split('/');

        if(arr[1] == "png" || arr[1] == "jpeg") {
            // setUrl(file.preview);
            setIsImage(true);
        }

        
    },[])

    const handleCancelImage = async (e) => {
       await  URL.revokeObjectURL(file.preview);
        cancel(file.id);
        AuthStore.action_setCancelImageIndex(indexs);
       
    }
    return (
        <div className="container_mess-uploadFile">
            {isImage ?  
            <>
               <img 
               src="https://img.icons8.com/material-two-tone/24/000000/close-window.png" 
               className="Upload_cancel" 
               onClick={handleCancelImage}
               />
                
                <img src={file.preview} className="container-image-upload_file"/>
            </>
            : 
            <> 
             <img 
               src="https://img.icons8.com/material-two-tone/24/000000/close-window.png" 
               className="Upload_cancel" 
               onClick={handleCancelImage}
               />
               <div className="container_upload-file">
                <FontAwesomeIcon icon="fa-solid fa-file" />
                <span>{file.name}</span>
               </div>
               
            </>
            
            
            }
            
        </div>
    );
})

export default Upload;