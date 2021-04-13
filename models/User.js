// Packages
const mongoose = require("mongoose");

//Model de user
const User = mongoose.model("User", {
  email: {
    unique: true,
    required: true,
    type: String,
  },
  username: String,
  description: String,
  token: String,
  hash: String,
  salt: String,
});
//Export du model User
module.exports = User;
