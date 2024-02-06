const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardGameSchema = new Schema({
  title: String,
  description: String,
  image: String,
  playerCountMin: { type: Number, required: true },
  playerCountMax: { type: Number, required: true },
  genres: { type: [String], default: [] },
  mechanics: { type: [String], default: [] },
});

module.exports = mongoose.model("BoardGame", boardGameSchema);