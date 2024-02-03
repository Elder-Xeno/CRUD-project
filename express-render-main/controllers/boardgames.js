const BoardGame = require('../models/boardgames');

const index = async (req, res) => {
    try {
      const boardGames = await BoardGame.find();
      res.render('boardgames', { boardGames });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };

  module.exports = {
    index,
  };
