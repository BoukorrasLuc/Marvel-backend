// import mongoose
const mongoose = require("mongoose");

//import user
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    // S'assurer qu'il y a un token
    if (req.headers.authorization) {
      // Obtenir le token utilisateur à partir des en-têtes HTTP
      const token = req.headers.authorization.replace("Bearer ", "");

      // Trouver l'utilisateur avec le token dans la base de données et sélectionner uniquement les clés utilisateur
      const user = await User.findOne({ token: token }).select("email token");

      // Si l'utilisateur avec le token existe, suivant
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
