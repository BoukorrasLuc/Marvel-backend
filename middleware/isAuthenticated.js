// import mongoose
const mongoose = require("mongoose");

// Models import
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    // Make sure there is a token
    if (req.headers.authorization) {
      // Obtain user token from HTTP headers
      const token = req.headers.authorization.replace("Bearer ", "");

      // Find the user with the token in the database and select only the user keys
      const user = await User.findOne({ token: token }).select("email token");

      if (user) {
        req.user = user;
        return next();
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Middleware export
module.exports = isAuthenticated;
