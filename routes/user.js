// Packages
const express = require("express");
const router = express.Router();

//Packages crypto
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// Models import
const User = require("../models/User");

// Route  /signup
router.post("/user/signup", async (req, res) => {
  try {
    // Find the user with email:
    const userEmail = await User.findOne({ email: req.fields.email });

    // Find the user with username:
    const userUserName = await User.findOne({ username: req.fields.username });
    if (userEmail) {
      res.status(409).json({ error: "This email is already used" });
    } else if (userUserName) {
      res.status(403).json({ error: "This username is already used !" });
    } else {
      // we create with the information we received in the input field.
      if (
        req.fields.username &&
        req.fields.password &&
        req.fields.email &&
        req.fields.description
      ) {
        // User creation.
        const salt = uid2(16);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const token = uid2(16);
        const newUser = new User({
          email: req.fields.email,
          username: req.fields.username,
          description: req.fields.description,
          token: token,
          salt: salt,
          hash: hash,
        });
        await newUser.save();
        res.json({
          _id: newUser._id,
          email: newUser.email,
          description: newUser.description,
          username: newUser.username,
          token: token,
        });
      } else {
        res.status(401).json({ error: "Missing parameters" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route  /login
router.post("/user/login", async (req, res) => {
  try {
    // Find the user with email:
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );
      // Compare new hash with the one in the DB:
      if (newHash === user.hash) {
        console.log(`User logged in: ${user.email}`);
        res.status(200).json({
          _id: user._id,
          token: user.token,
        });
      } else {
        res.status(401).json({
          message: "Incorrect email or password.",
        });
      }
    } else {
      res.status(401).json({
        message: "Incorrect email or password.",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route export
module.exports = router;
