//Dépendance pour le serveur
const express = require("express");

//Dépendance pour les routes
const router = express.Router();

//Dépendance pour les requetes vers l'api
const axios = require("axios");

// Route : all comics
router.get("/comics", async (req, res) => {
  try {
    let limit = 100;
    if (req.query.limit) {
      limit = Number(req.query.limit);
    }

    let skip = 0;
    if (req.query.skip) {
      skip = Number(req.query.skip);
    }

    let title = "";
    if (req.query.title) {
      title = req.query.title;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY_MARVEL}&limit=${limit}&skip=${skip}&title=${title}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/comics/:characterId", async (req, res) => {
  try {
    const characterId = req.params.characterId;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.API_KEY_MARVEL}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
  }
});
//Export de la route
module.exports = router;
