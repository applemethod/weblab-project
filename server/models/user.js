const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  googleid: String,
  email: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
