import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Chat.css";
import { get, post } from "../../utilities";
import CryptoJS from "crypto-js";
import Guess from "./Guess";
import Message from "./Message";
import { UserContext } from "../App";
import { GameContext } from "../pages/Game";

const Chat = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  const { messages, setMessages } = useContext(GameContext);
  const [curMessage, setCurMessage] = useState("");

  const newMessage = (message) => {
    console.log("new message: " + message);
    setMessages([
      ...messages,
      { message: message, user: userId, time: Date.now(), type: "message" },
    ]);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      newMessage(curMessage);
      setCurMessage("");
    }
  };

  return (
    <>
      <div className="chat-container">
        {messages.map((message) => {
          if (message.type === "guess") {
            return <Guess message={message} />;
          } else {
            return <Message message={message} />;
          }
        })}
        <input
          type="text"
          className={"chat-bar"}
          placeholder="Send Message..."
          value={curMessage}
          onChange={(e) => setCurMessage(e.target.value)}
          onKeyDown={handleEnter} // Handle Enter key
        />
      </div>
    </>
  );
};

export default Chat;
