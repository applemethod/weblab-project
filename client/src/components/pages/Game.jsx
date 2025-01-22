import React, { useContext, useState, createContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Game.css";
import NavBar from "../modules/NavBar";
import Chat from "../modules/Chat";
import { UserContext } from "../App";

export const GameContext = createContext(null);

const Game = (props) => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

  const [messages, setMessages] = useState([]);
  const [curGuess, setCurGuess] = useState("");

  const gamecontext = {
    messages: messages,
    setMessages: setMessages,
  };

  const newGuess = (guess) => {
    console.log("new guess: " + guess);
    setMessages([...messages, { message: guess, user: userId, time: Date.now(), type: "guess" }]);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      newGuess(curGuess);
      setCurGuess("");
    }
  };

  return (
    <>
      <NavBar />
      <GameContext.Provider value={gamecontext}>
        <input
          type="text"
          className={"guess-bar"}
          placeholder="Enter Guess..."
          value={curGuess}
          onChange={(e) => setCurGuess(e.target.value)}
          onKeyDown={handleEnter} // Handle Enter key
        />
        <h1>Good luck on your project :)</h1>
        <h2> What you need to change in this skeleton</h2>
        <ul>
          <li>
            Change the Frontend CLIENT_ID (index.jsx) to your team's CLIENT_ID (obtain this at
            http://weblab.is/clientid)
          </li>
          <li>Change the Server CLIENT_ID to the same CLIENT_ID (auth.js)</li>
          <li>
            Change the Database SRV (mongoConnectionURL) for Atlas (server.js). You got this in the
            MongoDB setup.
          </li>
          <li>Change the Database Name for MongoDB to whatever you put in the SRV (server.js)</li>
        </ul>
        <h2>How to go from this skeleton to our actual app</h2>
        <a href="https://docs.google.com/document/d/110JdHAn3Wnp3_AyQLkqH2W8h5oby7OVsYIeHYSiUzRs/edit?usp=sharing">
          Check out this getting started guide
        </a>
        <Chat />
      </GameContext.Provider>
    </>
  );
};

export default Game;
