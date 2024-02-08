const BoardGame = require('../models/boardgames');
const PlayLog = require('../models/plays');

const index = async (req, res) => {
  try {
    let { playerCount, genre, mechanics } = req.query;
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
        genres: { $in: [new RegExp(genre, 'i')] },
      };
    }

    if (mechanics) {
      filter = {
        ...filter,
        mechanics: { $in: [new RegExp(mechanics, 'i')] },
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
    console.log("Genres:", genres);
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
    const logs  = await PlayLog.find({ gameId: req.params.id });
    res.render("boardgames/show", {
      title: game.title,
      showBanner: true,
      bannerImage: "your-image.jpg",
      game,
      playLogs: logs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


const editGameForm = async (req, res) => {
  try {
    const game = await BoardGame.findById(req.params.id);
    res.render('boardgames/edit', { title: 'Edit Game', game });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, playerCountMin, playerCountMax, genres, mechanics } = req.body;
    const updatedGame = await BoardGame.findByIdAndUpdate(id, {
      title,
      description,
      playerCountMin,
      playerCountMax,
      genres: genres.split(',').map(genre => genre.trim()),
      mechanics: mechanics.split(',').map(mechanic => mechanic.trim())
    }, { new: true });
    res.redirect(`/boardgames/${updatedGame._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

const deleteBoardGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    console.log('Deleting game with ID:', gameId);
    await BoardGame.findByIdAndDelete(gameId);
    console.log('Game deleted successfully');
    res.redirect('/boardgames');
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
