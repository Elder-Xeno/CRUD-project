const PlayLog = require("../models/plays");
const BoardGame = require('../models/boardgames');

// Function to render play log form
const renderPlayLogForm = (req, res) => {
  const gameId = req.params.id;
  console.log("Game ID:", gameId);
  const { gameTitle, date, players, notes } = req.body;
  console.log("Received play data:", gameTitle, date, players, notes);
  res.render("plays/logForm", { title: "Log Play", gameId, gameTitle });
};

// Function to handle submitting play log
const logPlay = async (req, res) => {
  try {
    // Extract data from the request body
    const { gameTitle, date, players, notes } = req.body;

    // Check if gameTitle is provided
    if (!gameTitle) {
      return res.status(400).json({ error: "Game title is required" });
    }

    // Check if the game already exists in the collection
    let game = await BoardGame.findOne({ title: gameTitle });
    if (!game) {
      // If the game doesn't exist, create a new entry in the games collection
      game = new BoardGame({ title: gameTitle });
      await game.save();
    }

    // Log play
    const newPlayLog = new PlayLog({
      gameId: game._id,
      gameTitle,
      userId: req.user._id,
      date,
      players,
      notes,
    });
    await newPlayLog.save();

    // Send response indicating successful logging of play
    res
      .status(200)
      .json({ message: "Play logged successfully", playLog: newPlayLog });
  } catch (error) {
    console.error("Error logging play:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get play logs for a specific game
const getPlayLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const playLogs = await PlayLog.find({ gameId: id });
    res.json(playLogs);
  } catch (error) {
    console.error("Error fetching play logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to render play log form for adding a play to a game not in the collection
const renderGenericPlayLogForm = (req, res) => {
  const gameId = req.params.id; // Get the gameId from request parameters
  res.render("plays/genericLogForm", {
    gameId,
    showBanner: true,
    title: "Log Play",
  });
};

// Function to render all play logs
const renderAllPlayLogs = async (req, res) => {
    try {
      // Fetch all play logs
      const allPlayLogs = await PlayLog.find().populate("gameId");
      
      // Render a view to display all play logs
      res.render("plays/allPlayLogs", { playLogs: allPlayLogs });
    } catch (error) {
      console.error("Error fetching play logs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports = {
  renderPlayLogForm,
  logPlay,
  getPlayLogs,
  renderGenericPlayLogForm,
  renderAllPlayLogs,
  // update: updatePlayLog,
  // delete: deletePlayLog,
};
