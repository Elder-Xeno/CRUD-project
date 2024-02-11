const BoardGame = require("../models/boardgames");
const PlayLog = require("../models/plays");

const index = async (req, res) => {
  try {
    console.log("Request Query Parameters:", req.query);
    let { playerCount, genre, mechanics, ownershipStatus } = req.query;
    let filter = {};


    genre = genre ? genre.toUpperCase() : null;
    mechanics = mechanics ? mechanics.toUpperCase() : null;

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
        genres: { $in: [new RegExp(genre, "i")] },
      };
    }

    if (mechanics) {
      filter = {
        ...filter,
        mechanics: { $in: [new RegExp(mechanics, "i")] },
      };
    }

   if (ownershipStatus) {
      console.log("Applying Ownership Status Filter:", ownershipStatus);
      filter = {
        ...filter,
        ownershipStatus: ownershipStatus,
      };
    }

    console.log("Generated Filter:", filter);


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
    BoardGame: BoardGame,
  });
};

const createBoardGame = async (req, res) => {
  try {
    const {
      title,
      description,
      playerCountMin,
      playerCountMax,
      genres,
      mechanics,
      ownershipStatus,
    } = req.body;
    
    const image = req.file ? req.file.filename : "";
    const newBoardGame = new BoardGame({
      title,
      description,
      image,
      playerCountMin,
      playerCountMax,
      genres: genres.split(",").map((genre) => genre.trim()),
      mechanics: mechanics.split(",").map((mechanic) => mechanic.trim()),
      ownershipStatus,
    });

    await newBoardGame.save();
    res.redirect(`/boardgames/${newBoardGame._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const showBoardGame = async (req, res) => {
  try {
    const game = await BoardGame.findById(req.params.id);
    const logs = await PlayLog.find({ gameId: req.params.id });
    res.render("boardgames/show", {
      title: game.title,
      showBanner: true,
      bannerImage: "your-image.jpg",
      game,
      playLogs: logs,
      ownershipStatus: game.ownershipStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


const editGameForm = async (req, res) => {
  try {
    const game = await BoardGame.findById(req.params.id);
    res.render("boardgames/edit", { title: "Edit Game", game });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      playerCountMin,
      playerCountMax,
      genres,
      mechanics,
      ownershipStatus,
    } = req.body;

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    const updatedFields = {
      title,
      description,
      playerCountMin,
      playerCountMax,
      genres: genres.split(",").map((genre) => genre.trim()),
      mechanics: mechanics.split(",").map((mechanic) => mechanic.trim()),
      ownershipStatus,
    };

    if (image !== "") {
      updatedFields.image = image;
    }

    const existingGame = await BoardGame.findById(id);

    if (image === "" && existingGame.image) {
      updatedFields.image = existingGame.image;
    }

    const updatedGame = await BoardGame.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.redirect(`/boardgames/${updatedGame._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const deleteBoardGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    await BoardGame.findByIdAndDelete(gameId);
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
  show: showBoardGame,
  edit: editGameForm,
  update: updateGame,
  delete: deleteBoardGame,
};
