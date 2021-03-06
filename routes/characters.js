// Packages
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Route /all characters
router.get("/characters", async (req, res) => {
  try {
    let limit = 100;
    if (req.query.limit) {
      limit = Number(req.query.limit);
    }

    let skip = 0;
    if (req.query.skip) {
      skip = Number(req.query.skip);
    }

    let name = "";
    if (req.query.name) {
      name = req.query.name;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY_MARVEL}&limit=${limit}&skip=${skip}&name=${name}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
  }
});

// Route export
module.exports = router;
