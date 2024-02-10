const PlayLog = require("../models/plays");
const BoardGame = require("../models/boardgames");

// Function to format date in a specific format
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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
    const { gameTitle, date, players, notes } = req.body;
    if (!gameTitle) {
      return res.status(400).json({ error: "Game title is required" });
    }
    let game = await BoardGame.findOne({ title: gameTitle });
    if (!game) {
      game = new BoardGame({ title: gameTitle });
      await game.save();
    }
    const newPlayLog = new PlayLog({
      gameId: game._id,
      gameTitle,
      userId: req.user._id,
      date,
      players,
      notes,
    });
    await newPlayLog.save();
    res.redirect("/plays/playLogs");
  } catch (error) {
    console.error("Error logging play:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get play logs for a specific game
const getPlayLogs = async (req, res) => {
  try {
    const gameId = req.params.id;
    const playLogs = await PlayLog.find({ gameId }).populate("userId");
    res.render("boardgames/show", { game, playLogs });
  } catch (error) {
    console.error("Error fetching play logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Function to render play log form for adding a play to a game not in the collection
const renderGenericPlayLogForm = (req, res) => {
  const gameId = req.params.id;
  res.render("plays/genericLogForm", {
    gameId,
    showBanner: true,
    title: "Log Play",
  });
};

// Function to render the view for displaying game logs
const renderAllPlayLogs = async (req, res) => {
  try {
    const allGameLogs = await PlayLog.find().populate("gameId");
    const formattedGameLogs = allGameLogs.map((log) => ({
      ...log.toObject(),
      formattedDate: formatDate(log.date),
    }));
    const gameId = req.params.id;
    res.render("plays/allPlayLogs", { gameId, gameLogs: formattedGameLogs });
  } catch (error) {
    console.error("Error fetching game logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editPlayForm = async (req, res) => {
  try {
    const log = await PlayLog.findById(req.params.id);
    res.render("plays/edit", { title: "Edit Play Log", log });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Function to update a play log
const updatePlayLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { gameTitle, date, players, notes } = req.body;

    await PlayLog.findByIdAndUpdate(
      id,
      {
        gameTitle,
        date,
        players,
        notes,
      },
      { new: true }
    );
    res.redirect("/plays/playLogs");
  } catch (error) {
    console.error("Error updating play log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to delete a play log
const deletePlayLog = async (req, res) => {
  try {
    const playId = req.params.id;
    await PlayLog.findByIdAndDelete(playId);
    res.redirect("/plays/playLogs");
  } catch (error) {
    console.error("Error deleting play log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  formatDate,
  renderPlayLogForm,
  logPlay,
  getPlayLogs,
  renderGenericPlayLogForm,
  renderAllPlayLogs,
  edit: editPlayForm,
  update: updatePlayLog,
  delete: deletePlayLog,
};
