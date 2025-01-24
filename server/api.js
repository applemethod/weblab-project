/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
// const Game = require("./models/game");
// const Room = require("./models/room");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

// router.post("/login", auth.login);
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { token } = req.body;

  console.log("Received token:", token);

  try {
    // Decode the token
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const googleId = decodedToken.sub; // Google unique user ID
    const email = decodedToken.email;
    const name = decodedToken.name;

    console.log("Decoded user info:", { googleId, email, name });

    // Check if the user exists in the database
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create a new user if they don't exist
      user = new User({ googleId, email, username: name });
      console.log("Created new user:", user);
      await user.save();
    } else {
      // Optionally update user information if necessary
      user.email = email;
      user.username = name;
      await user.save();
    }

    res.status(200).json(user); // Return the user object to the frontend
  } catch (error) {
    console.error("Error handling login:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/update-username", async (req, res) => {
  const { userId, newUsername } = req.body;

  try {
    // Validate the new username (e.g., check for empty or invalid values)
    if (!newUsername || newUsername.trim() === "") {
      return res.status(400).json({ error: "Username cannot be empty." });
    }

    // Find the user by ID and update their username
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.username = newUsername; // Update the username
    await user.save(); // Save changes to the database

    res.status(200).json({ message: "Username updated successfully!" });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "An error occurred while updating the username." });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log("Fetching user for ID:", userId); // Log the ID received

  try {
    const user = await User.findById(userId);
    console.log("Database query result:", user); // Log the query result

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "An error occurred while fetching the user." });
  }
});

// router.post("newroom/:gameId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await Room.findById(userId);
//     if (!user) {
//       console.log("User not found");
//       return res.status(404).json({ error: "User not found" });
//     } else {
//       user.room = req.body.room;
//       await user.save();
//       res.status(200).json(user);
//     }
//   } catch (error) {
//     console.error("Error fetching user:", error.message);
//     res.status(500).json({ error: "An error occurred while fetching the user." });
//   }
// });

// router.post("/newgame", async (req, res) => {
//   const { game } = req.body;

//   console.log("Received game:", game);

//   try {
//     let oldgame = await Game.findOne({ gameId: game.gameId });
//     if (!oldgame) {
//       const newGame = new Game(game);
//       await newGame.save();
//       res.status(201).json(newGame);
//     } else {
//       oldgame = game;
//       await oldgame.save();
//       res.status(200).json(oldgame);
//     }
//   } catch (error) {
//     console.error("Error creating game:", error.message);
//     res.status(500).json({ error: "An error occurred while creating the game." });
//   }
// });

// router.post("/endgame/:gamdId", async (req, res) => {
//   const { gameId } = req.params;

//   try {
//     const game = await Game.findOne({ gameId });

//     if (!game) {
//       console.log("Game not found");
//       return res.status(404).json({ error: "Game not found" });
//     }

//     game.status = "ended";
//   } catch (error) {
//     console.error("Error fetching game:", error.message);
//     res.status(500).json({ error: "An error occurred while fetching the game." });
//   }
// });

// router.get("/gameinfo/:gameId", async (req, res) => {
//   const { gameId } = req.params;

//   console.log("Fetching game for ID:", gameId); // Log the ID received

//   try {
//     const game = await User.findOne({ gameId });
//     console.log("Database query result:", user); // Log the query result

//     if (!game) {
//       console.log("Game not found");
//       return res.status(404).json({ error: "Game not found" });
//     }

//     res.status(200).json(game);
//   } catch (error) {
//     console.error("Error fetching user:", error.message);
//     res.status(500).json({ error: "An error occurred while fetching the user." });
//   }
// });

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
