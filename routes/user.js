//Dépendance pour le serveur
const express = require("express");

//Dépendance pour les routes
const router = express.Router();

// Packages crypto
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// Model Import
const User = require("../models/User");

// Route:  /signup
router.post("/user/signup", async (req, res) => {
  try {
    // Je vérifie que l'email ne soit pas utilisé !
    const userEmail = await User.findOne({ email: req.fields.email });

    // Je vérifie que l'utilisateur ne soit pas utilisé !
    const userUserName = await User.findOne({ username: req.fields.username });
    if (userEmail) {
      //Si l'email existe.
      res.status(409).json({ error: "This email is already used" });
    } else if (userUserName) {
      //Si l'username existe.
      res.status(403).json({ error: "This username is already used !" });
    } else {
      //Sinon on le créer avec les infos que l'on a reçu dans le champ de saisi
      if (
        req.fields.username &&
        req.fields.password &&
        req.fields.email &&
        req.fields.description
      ) {
        //Création du user.
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
        //Requete pour sauvegarder le user.
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

// Route:  /login
router.post("/user/login", async (req, res) => {
  try {
    // Test user email
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      // Si l'user n'existe pas,on le crée
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );
      // On compare le hash avec la base de données.
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
//Export de la route
module.exports = router;
