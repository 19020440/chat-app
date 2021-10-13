import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer'
import './callvideo.css'
import {observer} from 'mobx-react-lite'
import {useStore} from '../../hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {faMicrophone, faPhone} from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router';
import _ from 'lodash';
library.add(fab,faPhone,faMicrophone) 


const  CallVideo = observer((props) => {
    const search = useLocation().search;
    const from = new URLSearchParams(search).get('from');
    const room = new URLSearchParams(search).get('room');
    const signal = new URLSearchParams(search).get('signal');
    const sif = new URLSearchParams(search).get('sif');
    const status = new URLSearchParams(search).get('status');
    const AuthStore = useStore('AuthStore');
    const ActionStore = useStore('ActionStore')
    const myVideo = useRef();
    const [ stream, setStream ] = useState();
    const {profileOfFriend} = ActionStore;
    const {user} = AuthStore;
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState()
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const userVideo = useRef()
	const connectionRef= useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
				myVideo.current.srcObject = stream
		})
    // AuthStore?.socket.on("callUser", (data) => {
		// 	// setReceivingCall(true)
    //   console.log(data);
		// 	setCaller(data.from)
		// 	setCallerSignal(data.signal)
		// })
    },[])
    
    useEffect(() => {

      if(status == 0) callUser();
    },[])


    useEffect(() => {
          if(status == 1) {
            const signals = JSON.parse(signal);
            setCallAccepted(true)
            const peer = new Peer({
              initiator: false,
              trickle: false,
              stream: stream
            })
            peer.on("signal", (data) => {
              console.log("this is socketid: ", sif); 
              AuthStore?.socket.emit("answerCall", { signal: data, to: sif })
            })
            peer.on("stream", (stream) => {
              
              userVideo.current.srcObject = stream
            })

            peer.signal(signals)
            connectionRef.current = peer
        }
      },[])

      const callUser = async () => {
        
    }
    const handleCloseVideo = () => {
        
    }

    // useEffect(() => {
    //   return () => {
    //     AuthStore?.socket.emit("disconnect", "callVideo")
    //   }
    // },[])
    return (
        <div className="container_video">
        <div className="header_video">
          {/* <div className="header_video-call-again">
            <div>
              <img src="https://img.icons8.com/ios/25/000000/video-call.png"/>
            </div>
           
            <p>gọi lại</p>
          </div>
          <div className="header_video-close">
            <div>
              <img src="https://img.icons8.com/material-outlined/25/000000/delete-sign.png"/>
            </div>
            
            <p>Đóng</p>
          </div> */}

        </div>

          <div className="video_container-another-user">
          {callAccepted ?
					<video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
					null}
          </div>
          {console.log(userVideo)}

        <div className="footer_video-me">
          <div className="footer_click" onClick={handleCloseVideo}>
            <img src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-right-arrows-those-icons-lineal-those-icons-3.png"/>
          </div>
          <div className="footer_video-of-me">
            {console.log(myVideo)}
            {stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
          </div>
        </div>

        <div className="footer_video">
          <div>
            <img src="https://img.icons8.com/ios/25/000000/video-call.png"/>
            <FontAwesomeIcon icon="fa-solid fa-microphone" />
            <FontAwesomeIcon icon="fa-solid fa-phone" />
          </div>
          
        </div>
    </div>
     
    );
})

export default CallVideo;