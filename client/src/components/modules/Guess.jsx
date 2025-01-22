import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./Guess.css";

import ProfileIcon from "./ProfileIcon";

const Guess = (props) => {
  const message = props.message;
  const userId = message.user;

  return (
    <>
      <div className="guess-container">
        <ProfileIcon userId={userId} />
        <div className="guess-header">{"guessed "}</div>
        <div className="guess">{message.message}</div>
      </div>
    </>
  );
};

export default Guess;
