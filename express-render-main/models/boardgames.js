const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardGameSchema = new Schema({
  title: { type: String, required: true },
  // Add image, button and other properties
});

module.exports = mongoose.model("BoardGame", boardGameSchema);
