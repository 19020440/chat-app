import React, { useEffect, useRef, useState } from 'react';
import './camera.css'
import {Row, Col,Button} from 'antd';
import {PhotoCamera} from '@material-ui/icons'
import {forwardRef} from 'react'
function Camera({videoRef, status}) {

    // const videoRef = useRef(null);
    const photoRef = useRef(null);
    const imageRef = useRef(null);
    const [hasPhoto,setHasPhoto] = useState(false);
 
    
    useEffect(() => {
        return () => {
            console.log(132);
            
        }
    },[])
    const takePhoto = () => {
        const width = 500;
        const height = 500;

        let video = videoRef.current;
        let photo = photoRef.current;
        photo.width = width;
        photo.height = height;
        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        photo.toBlob(function (blob) {
            imageRef.current = URL.createObjectURL(blob);
            console.log(URL.createObjectURL(blob));
            videoRef.current.newSrc = photo.toDataURL();
        },'image/png')
        setHasPhoto(true);
    }

    // useEffect(() => {
    //     getVideo();
    // },[videoRef, status])
    return (
        <Row className="camera-picture">
            <Col span={24} className="snap-picture">
                <video ref={videoRef}></video>
                <span style={{width: '50px', height: '50px', background: 'grey',position: 'absolute', bottom: '8px', left: '1px',borderRadius: '50%', zIndex: 10, textAlign: 'center'}}>
                    <PhotoCamera onClick={takePhoto} style={{ width: '80%', height: '80%',marginTop: '10%'}}/>
                </span>
               
            </Col>
         
            <Col span={24} style={{position: 'absolute'}}>
                <canvas ref={photoRef}> </canvas>
                <Button hidden={!hasPhoto} onClick={() => {
                    let photo = photoRef.current;
                    let ctx = photo.getContext('2d');
                    ctx.clearRect(0, 0, photo.width, photo.height);
                    setHasPhoto(false);
                }}>Quay lại</Button>
            </Col>
        </Row>
    );
}

export default forwardRef(Camera);