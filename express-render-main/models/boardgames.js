const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardGameSchema = new Schema({
  title: String,
  description: String,
  image: String,
  playerCountMin: { type: Number },
  playerCountMax: { type: Number },
  genres: { type: [String], default: [] },
  mechanics: { type: [String], default: [] },
  ownershipStatus: {
    type: String,
    enum: [
      "Personal Collection",
      "Friends Collection",
      "Group Collection",
      "Online",
    ],
  },
});

module.exports = mongoose.model("BoardGame", boardGameSchema);
