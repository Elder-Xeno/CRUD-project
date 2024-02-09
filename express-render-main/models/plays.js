const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playSchema = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "BoardGame",
      required: true,
    },
    gameTitle: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    players: {
      type: [String],
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlayLog", playSchema);
