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

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "453302824512-914u9ln0fsf2jp3imatgmflarsv01qjh.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if the user exists in the database
    let user = await User.findOne({ googleId });
    if (!user) {
      // Create a new user if they don't exist
      user = new User({ googleId, email, username: name });
      await user.save();
    } else {
      // Optionally update user information if necessary
      user.email = email;
      user.username = name;
      await user.save();
    }

    res.status(200).json(user); // Return the user object to the frontend
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
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
    const user = await User.findOne({ googleId: userId });
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

  try {
    // Find the user in the database by their ID
    const user = await User.findOne({ googleId: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the username and email
    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "An error occurred while fetching the user." });
  }
});

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
