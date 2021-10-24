import React, { useEffect, useRef, useState } from 'react';
import './camera.css'
function Camera(props) {

    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const imageRef = useRef(null);
    const [hasPhoto,setHasPhoto] = useState(false);
    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({
            video: {width: 1920, height: 1080}
        })
        .then((stream) => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.err(err);
        })
    }

    const takePhoto = () => {
        const width = 414;
        const height = width / (16/9);

        let video = videoRef.current;
        let photo = photoRef.current;
        photo.width = width;
        photo.height = height;
        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        // var image = new Image();
        // image.src = photo.toDataURL();
        imageRef.current.src = photo.toDataURL();
        setHasPhoto(true);
    }

    useEffect(() => {
        getVideo();
    },[videoRef])
    return (
        <div className="App_camera">
            <div className="camera">
                <video ref={videoRef}></video>
                <button onClick={takePhoto}>SNAP!</button>
            </div>

            <div className={'result' + (hasPhoto ? 'hasPhoto' : '')}>
                <canvas ref={photoRef}> </canvas>
                <img ref={imageRef}/>
                <button>Close!</button>
            </div>
        </div>
    );
}

export default Camera;