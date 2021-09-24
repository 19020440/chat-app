import React, { useContext, useState, useEffect } from "react";
// import close from "../assets/close.svg";
// import edit from "../assets/edit.png";
// import Loader from "../components/loader";
// import { axiosHandler, errorHandler, getToken } from "../helper";
// import { userDetailAction } from "../stateManagement/actions";
// import { store } from "../stateManagement/store";
// import { PROFILE_URL, FILE_UPLOAD_URL } from "../urls";

export const UserMain = (props) => {
  let _count = 0;
  if(props.count){
    if(parseInt(props.count) > 0){
      _count = props.count;
    }
  }
  return (
    <div
      className={`flex align-center justify-between userMain ${
        props.clickable ? "clickable" : ""
      }`}
      onClick={() => props.clickable && props.onClick()}
    >
      <UserAvatar
        isV2
        name={props.name}
        profilePicture={props.profilePicture}
        caption={props.caption}
      />
      {
        _count > 0 && <div className="counter">{props.count}</div>
      }
      
    </div>
  );
};

export const UserAvatar = (props) => {
  return (
    <div className={`userAvatar ${props.isV2 ? "version2" : ""}`}>
      <div
        className="imageCon"
        style={{
          backgroundImage: `url("${props.profilePicture}")`,
        }}
      />
      <div className="contents">
        <div className="name">{props.name}</div>
        {!props.noStatus && <div className="subContent">{props.caption}</div>}
      </div>
    </div>
  );
};

export const ChatBubble = (props) => {
  return (
    <div className={`chatbubbleCon ${props.bubbleType}`}>
      <div className="chatbubble">
        <p>{props.message}</p>
        <div className="time">{props.time}</div>
      </div>
    </div>
  );
};

let profileRef;

