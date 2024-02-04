const BoardGame = require("../models/boardgames");

const index = async (req, res) => {
  try {
    const boardGames = await BoardGame.find();
    res.render("boardgames/index", { boardGames });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const newBoardGameForm = (req, res) => {
  res.render("boardgames/add");
};

const createBoardGame = async (req, res) => {
  try {
    console.log("Received form data:", req.body);
    const { title, description } = req.body;
    console.log("Title:", title);
    const image = req.file ? req.file.filename : '';
    const newBoardGame = new BoardGame({
      title,
      description,
      image,
      // Add more properties
    });
    console.log("New board game:", newBoardGame);
    
    await newBoardGame.save();
    res.redirect("/boardgames");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  index,
  new: newBoardGameForm,
  create: createBoardGame,
};
