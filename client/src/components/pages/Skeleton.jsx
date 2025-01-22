import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./Skeleton.css";
import NavBar from "../modules/NavBar";
import NewGame from "../modules/NewGame";
import JoinGame from "../modules/JoinGame";
import { UserContext } from "../App";

const Skeleton = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <div className="container">
        <h1>Geography Alphabet Chain</h1>
        <div>
          <h2>blah blah blah</h2>
        </div>
      </div>
      <div className="container">
        <NewGame />
      </div>
      <div className="container">
        <JoinGame />
      </div>
    </>
  );
};

export default Skeleton;
