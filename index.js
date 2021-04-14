//Packages
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const mongoose = require("mongoose");

//dotenv
require("dotenv").config();

// App
const app = express();
app.use(formidable());
app.use(cors());

// CONNECTION TO MONGODB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Route Welcome
app.get("/", (req, res) => {
  res.json("Welcome Marvel");
});

// Route Comics
const comicsRoute = require("./routes/comics");
app.use(comicsRoute);

// Route Characters
const charactersRoute = require("./routes/characters");
app.use(charactersRoute);

// Route user
const userRoute = require("./routes/user");
app.use(userRoute);

//Error
app.all("*", (req, res) => {
  res.status(404).json({ message: "Cette route n'existe pas" });
});

//Port
app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
