import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../utilities.css";
import "./NewGame.css";

const JoinGame = () => {
  const [gameId, setGameId] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/games/${gameId}`);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };
  return (
    <>
      <div className="joingame-container">
        <div
          className="search-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="creategame">Join Game</div>
          <div className="container">
            {isHovered ? (
              <input
                type="text"
                className={`search-box ${isHovered ? "expanded" : ""}`}
                placeholder="Enter Game Id..."
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                onKeyDown={handleEnter} // Handle Enter key
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinGame;
