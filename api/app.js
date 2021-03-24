require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8001;
const { QueryTypes } = require("sequelize");

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

app.use(bodyParser.json());

module.exports = app;