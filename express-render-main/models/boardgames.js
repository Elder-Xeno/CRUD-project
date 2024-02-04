const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardGameSchema = new Schema({
  title: String,
  // Add image, button and other properties
  description: String,
  image: String,
});

module.exports = mongoose.model("BoardGame", boardGameSchema);