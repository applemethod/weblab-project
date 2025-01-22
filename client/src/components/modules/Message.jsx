import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./Message.css";

import ProfileIcon from "./ProfileIcon";

const Message = (props) => {
  const message = props.message;
  const userId = message.user;

  return (
    <>
      <div className="message-container">
        <ProfileIcon userId={userId} />
        <div className="message">{message.message}</div>
      </div>
    </>
  );
};

export default Message;
