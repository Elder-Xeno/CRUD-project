const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/boardgames')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', ensureLoggedIn, gamesCtrl.index);

module.exports = router;