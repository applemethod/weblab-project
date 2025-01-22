import React, { useContext } from "react";
import { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./GameMenu.css";
import NavBar from "../modules/NavBar";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";

const levels = ["Easy", "Medium", "Hard"];

const GameMenu = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  const [time, setTime] = useState(30);
  const [increment, setIncrement] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const gameId = useParams().gameId;

  return (
    <>
      <NavBar />
      <div className="gamemenu-container">
        <div className="player-container">{/* get a list of the players and display them*/}</div>

        <div className="settings">
          <div className="settings-header">
            <h1>Game Settings</h1>
          </div>
          <div className="slider-container">
            <h2>Time Control</h2>
            <input
              type="range"
              min="0"
              max="60"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="slider"
            />
            <div className="slider-label">
              <span>0</span>
              <span>30</span>
              <span>60</span>
            </div>
            <p>Selected Time: {time} minutes</p>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="30"
              value={increment}
              onChange={(e) => setIncrement(e.target.value)}
              className="slider"
            />
            <div className="slider-label">
              <span>0</span>
              <span>15</span>
              <span>30</span>
            </div>
            <p>Selected Increment: {increment} seconds</p>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max={levels.length - 1} // Match slider range to number of levels
              step="1" // Ensure discrete steps
              value={levelIndex} // Controlled value
              onChange={(e) => setLevelIndex(e.target.value)}
              className="slider2"
            />
            <div className="slider2-labels">
              {levels.map((level, index) => (
                <span key={index}>{level}</span>
              ))}
            </div>
            <p>Selected Difficulty: {levels[levelIndex]}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameMenu;
