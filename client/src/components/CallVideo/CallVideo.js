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
    const roomID = new URLSearchParams(search).get('room');
    const status = new URLSearchParams(search).get('status');
    const AuthStore = useStore('AuthStore');
    const ActionStore = useStore('ActionStore')
    const myVideo = useRef();
    const [peers, setPeers] = useState([]);
    const peersRef = useRef([]);


    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          if(status != 1) AuthStore?.socket.emit("join room", {roomID,from});
				  myVideo.current.srcObject = stream;

                  const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream,
                    });        
                peer.on("signal", signal => {
                   AuthStore?.socket.emit("sending signal", { signal,roomID,userId: from })
                })
                setPeers([peer]);

        //    AuthStore?.socket.on("all users", users => {
        //         const peers = [];
        //         users.forEach(userID => {
        //             const peer = createPeer(userID,AuthStore?.socket.id, stream);
                    peersRef.current.push({
                        // peerID: userID,
                        peer,
                    })
        //             peers.push(peer);
        //         })
        //         setPeers(peers);
        //     })

           AuthStore?.socket.on("user joined", payload => {
               if(from != payload.userId) {
                const peer = addPeer(payload.signal, stream);
                // peersRef.current.push({
                //     peerID: payload.userId,
                //     peer,
                // })

                setPeers(users => [...users, peer]);
               }
               
            });

           AuthStore?.socket.on("receiving returned signal", payload => {
                // const item = peersRef.current.find(p => p.peerID === payload.id);
                // item.peer.signal(payload.signal);
                console.log("trturn");
                if(from != payload.userId   )  {
                    console.log(peersRef.current[0]);
                    peersRef.current[0].peer.signal(payload.signal )
                }
               
            });
       
		    })
            
    },[]);

//     function createPeer(userToSignal, callerID, stream) {
//       const peer = new Peer({
//           initiator: true,
//           trickle: false,
//           stream,
//       });

//       peer.on("signal", signal => {
//          AuthStore?.socket.emit("sending signal", { userToSignal, callerID, signal })
//       })

//       return peer;
//   }

  function addPeer(incomingSignal, stream) {
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
      })

      peer.on("signal", signal => {
         AuthStore?.socket.emit("returning signal", { signal, roomID,userId: from })
      })

      peer.signal(incomingSignal);

      return peer;
  }
    
   


    
    return (
      <>
      <video muted ref={myVideo} autoPlay playsInline />
         {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
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