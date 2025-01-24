let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object
const rooms = {};

// Utility Functions
const getAllConnectedUsers = () => Object.values(socketToUserMap);
const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.sockets.get(socketid);

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // Disconnect old socket if the user reconnects
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

// Room Management
const addToRoom = (roomId, userId) => {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      leader: userId,
      players: [],
      settings: {
        maxPlayers: 4,
        levelIndex: 0,
        time: 30,
        increment: 0,
      },
      game: {
        started: false,
        chat: [],
      },
    }; // Create room if it doesn't exist
  }

  if (rooms[roomId].players.length >= rooms[roomId].settings.maxPlayers) {
    console.log("Room is full");
    return;
  }

  rooms[roomId].players.push(userId); // Add user to the room
};

const removeFromRoom = (roomId, userId) => {
  if (rooms[roomId]) {
    rooms[roomId].players = rooms[roomId].players.filter((playerId) => playerId !== userId); // Remove user from room
    if (rooms[roomId].players.length === 0) {
      delete rooms[roomId]; // Delete room if it's empty
    } else if (rooms[roomId].leader === userId) {
      rooms[roomId].leader = rooms[roomId].players[0];
    }
  }
};

const getRoom = (roomId) => {
  if (!rooms[roomId]) {
    return null;
  }
  return rooms[roomId];
};

const changeTime = (roomId, time) => {
  if (rooms[roomId]) {
    rooms[roomId].settings.time = time;
  } else {
    return null;
  }
};

const changeIncrement = (roomId, increment) => {
  if (rooms[roomId]) {
    rooms[roomId].settings.increment = increment;
  } else {
    return null;
  }
};

// Initialization
module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Handle user joining a room
      socket.on("join_room", ({ roomId, user }) => {
        console.log(`${user} is joining room: ${roomId}`);

        addToRoom(roomId, user); // Add user to room
        addUser(user, socket); // Map user to socket
        socket.join(roomId); // Add the socket to the room

        // Broadcast updated player list to the room
        io.to(roomId).emit("update_players", getRoom(roomId));
      });

      // Handle user leaving a room
      socket.on("leave_room", ({ roomId }) => {
        const user = getUserFromSocketID(socket.id);
        if (user) {
          console.log(`${user.username} is leaving room: ${roomId}`);

          removeFromRoom(roomId, user); // Remove user from room
          socket.leave(roomId); // Remove the socket from the room

          // Broadcast updated player list to the room
          io.to(roomId).emit("update_players", getRoom(roomId));
        }
      });

      // Handle user disconnecting
      socket.on("disconnect", () => {
        const user = getUserFromSocketID(socket.id);
        if (user) {
          console.log(`${user.username} disconnected`);

          // Remove the user from all rooms they were part of
          for (const roomId in rooms) {
            removeFromRoom(roomId, user);
            io.to(roomId).emit("update_players", getRoom(roomId));
          }

          removeUser(user, socket);
        }
      });

      socket.on("change_time", ({ roomId, time }) => {
        changeTime(roomId, time);
      });

      socket.on("change_increment", ({ roomId, increment }) => {
        changeIncrement(roomId, increment);
      });

      socket.on("start_game", ({ roomId }) => {
        if (rooms[roomId]) {
          rooms[roomId].game.started = true;
        }
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
