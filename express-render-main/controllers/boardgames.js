const BoardGame = require("../models/boardgames");

const index = async (req, res) => {
  try {
    const { playerCount, genre, mechanics } = req.query;
    let filter = {};

    if (playerCount) {
      filter = {
        ...filter,
        playerCountMin: { $lte: playerCount },
        playerCountMax: { $gte: playerCount },
      };
    }

    if (genre) {
      filter = {
        ...filter,
        genres: { $in: [genre] },
      };
    }

    if (mechanics) {
      filter = {
        ...filter,
        mechanics: { $in: [mechanics] },
      };
    }

    const boardGames = await BoardGame.find(filter);
    res.render("boardgames/index", {
      title: "Board Game Collection",
      boardGames,
      showBanner: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const newBoardGameForm = (req, res) => {
  res.render("boardgames/add", {
    title: "Add a New Board Game",
    showBanner: false,
  });
};

const createBoardGame = async (req, res) => {
  try {
    console.log("Received form data:", req.body);
    const { title, description, playerCountMin, playerCountMax, genres, mechanics } = req.body;
    console.log("Title:", title);
    console.log("Genres:", genres); // Log the genres field
    const image = req.file ? req.file.filename : '';
    const newBoardGame = new BoardGame({
      title,
      description,
      image,
      playerCountMin,
      playerCountMax,
      genres: genres.split(',').map(genre => genre.trim()),
      mechanics: mechanics.split(',').map(mechanic => mechanic.trim())
    });
    console.log("New board game:", newBoardGame);
    
    await newBoardGame.save();
    res.render("boardgames/show", { title: newBoardGame.title, showBanner: true, bannerImage: "your-image.jpg", game: newBoardGame });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


const showBoardGame = async (req, res) => {
  try {
    const game = await BoardGame.findById(req.params.id);
    res.render("boardgames/show", {
      title: game.title,
      showBanner: true,
      bannerImage: "your-image.jpg",
      game,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  index,
  new: newBoardGameForm,
  create: createBoardGame,
  show: showBoardGame,
};
