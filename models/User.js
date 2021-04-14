// Packages
const mongoose = require("mongoose");

// Models user
const User = mongoose.model("User", {
  email: {
    unique: true,
    required: true,
    type: String,
  },
  username: String,
  token: String,
  hash: String,
  salt: String,
});

// Export model User
module.exports = User;
