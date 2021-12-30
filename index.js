const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    console.log("eroor");
  }
  console.log("BACKEND running on port!");
});
