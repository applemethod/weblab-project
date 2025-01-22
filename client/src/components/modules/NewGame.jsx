import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "../../utilities.css";
import "./NewGame.css";
import { UserContext } from "../App";

const NewGame = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

  const gameId = Math.floor(Math.random() * 100000000).toString(36);

  return (
    <>
      <div className="newgame-container">
        <Link to={`/games/${gameId}`} className="creategame">
          Create Game
        </Link>
      </div>
    </>
  );
};

export default NewGame;
