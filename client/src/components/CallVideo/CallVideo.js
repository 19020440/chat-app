import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer'
import './callvideo.css'
import {observer} from 'mobx-react-lite'
import {useStore} from '../../hook'
import { useLocation } from 'react-router';
import _ from 'lodash';
import {Row, Col} from 'antd';
import {ChevronRight} from '@material-ui/icons'

const  CallVideo = observer((props) => {
    const search = useLocation().search;
    const from = new URLSearchParams(search).get('from');
    const roomID = new URLSearchParams(search).get('room');
    const status = new URLSearchParams(search).get('status');
    const AuthStore = useStore('AuthStore');
    const ActionStore = useStore('ActionStore')
    const myVideo = useRef();
    const [peers, setPeers] = useState([]);
    const [hiddenMyVideo,setHiddenMyVideo] = useState(false);
    const peersRef = useRef([]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            myVideo.current.srcObject = stream;
            AuthStore.socket.emit("join room", {newRoomId: roomID + "1",roomId: roomID, from,status});
            AuthStore.socket.on("all users", users => {
                console.log("user: ", users);
                const peers = [];
                users.forEach((userID, index) => {
                    const peer = createPeer(from, stream,index);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            AuthStore.socket.on("user joined", payload => {
                console.log(" iam joinded");
                const peer = addPeer(payload.signal, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            AuthStore.socket.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer( callerID, stream, index) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        // if(index == 0) {
            peer.on("signal", signal => {
                AuthStore.socket.emit("sending signal", { roomID: roomID + "1", callerID, signal })
            })
        // }
        

        return peer;
    }

    function addPeer(incomingSignal, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            AuthStore.socket.emit("returning signal", { signal, roomID: roomID + "1", from})
        })

        peer.signal(incomingSignal);

        return peer;
    }
    
    return (
      <>
      
        
            <Row style={{padding: '16px 50px',position: "relative",height: '100%'}}>
                {peers.map((peer, index) => {
                    return (
                        <Col span={_.size(peer) == 1 ? 24 : _.size(peer) == 2 ? 12 : 24} style={{position: 'fixed', top: 0,bottom: 0, right:0,left: 0}}>
                            <Video key={index} peer={peer} />
                        </Col>
                        
                    );
                })}
                <Col span={6} style={{position: "fixed",bottom: 0,right: 0}} className={hiddenMyVideo ? "smooth-my-video" : ""}>
                    <Row>
                        <Col span={2} onClick={() => {
                            setHiddenMyVideo(!hiddenMyVideo)
                        }}>
                            <ChevronRight className="icon-chevronRight-callvideo"/>
                        </Col>
                        <Col span={22} className="My-video-call">
                            <video muted ref={myVideo} autoPlay playsInline />
                        </Col>
                    </Row>
                </Col>
            </Row>
      </>
     
    );
})


const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
      props.peer.on("stream", stream => {
          ref.current.srcObject = stream;
      })
  }, []);

  return (
      <video playsInline autoPlay ref={ref} />
  );
}



export default CallVideo;