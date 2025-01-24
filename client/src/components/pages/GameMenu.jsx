import React, { useContext, useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import "../../utilities.css";
import "./GameMenu.css";
import NavBar from "../modules/NavBar";
import ProfileIcon from "../modules/ProfileIcon";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://geographyalphabetchain.onrender.com"); // Connect to the backend

const levels = ["Easy", "Medium", "Hard"];

const GameMenu = () => {
  const { userId } = useContext(UserContext);
  const [time, setTime] = useState(30);
  const [increment, setIncrement] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [leader, setLeader] = useState(null);
  const [players, setPlayers] = useState([]); // State for the list of players
  const gameId = useParams().gameId;
  const navigate = useNavigate();

  // Join the room and handle updates
  useEffect(() => {
    if (!userId) return;

    // Join the room
    socket.emit("join_room", {
      roomId: gameId,
      user: userId,
    });

    // Listen for player updates
    socket.on("update_players", (room) => {
      if (room && room.players) {
        setLeader(room.leader);
        setPlayers(room.players); // Update the list of players
        setTime(room.settings.time); // Sync time
        setIncrement(room.settings.increment); // Sync increment
        setLevelIndex(room.settings.levelIndex); // Sync level
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.emit("leave_room", { roomId: gameId });
      socket.off("update_players");
    };
  }, [userId, gameId]);

  // Emit time change
  const handleTimeChange = (value) => {
    setTime(value);
    socket.emit("change_time", { roomId: gameId, time: value });
  };

  // Emit increment change
  const handleIncrementChange = (value) => {
    setIncrement(value);
    socket.emit("change_increment", { roomId: gameId, increment: value });
  };

  // Emit difficulty level change
  const handleLevelChange = (value) => {
    setLevelIndex(value);
    socket.emit("change_level", { roomId: gameId, levelIndex: value });
  };

  return (
    <>
      <NavBar />
      <div className="gamemenu-container">
        <div className="player-container">
          <h1>Players in Room</h1>
          <ul>
            {players.map((playerId) => {
              if (playerId === leader) {
                return (
                  <>
                    <p>Leader: </p>
                    <ProfileIcon userId={playerId} />
                  </>
                );
              } else {
                return <ProfileIcon userId={playerId} />;
              }
            })}
          </ul>
          <button
            onClick={() => {
              socket.emit("start_game", { roomId: gameId });
            }}
            className="start-button"
          >
            Start
          </button>
        </div>

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
              onChange={(e) => handleTimeChange(e.target.value)}
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
            <h2>Increment</h2>
            <input
              type="range"
              min="0"
              max="30"
              value={increment}
              onChange={(e) => handleIncrementChange(e.target.value)}
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
            <h2>Difficulty</h2>
            <input
              type="range"
              min="0"
              max={levels.length - 1} // Match slider range to number of levels
              step="1" // Ensure discrete steps
              value={levelIndex} // Controlled value
              onChange={(e) => handleLevelChange(e.target.value)}
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
