const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/boardgames')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', gamesCtrl.index);

router.get('/add', ensureLoggedIn, gamesCtrl.new);

router.post('/add', ensureLoggedIn, gamesCtrl.create);

router.get('/:id', ensureLoggedIn, gamesCtrl.show);

router.get('/:id/edit', ensureLoggedIn, gamesCtrl.edit);

router.put('/:id', ensureLoggedIn, gamesCtrl.update);

router.post('/:id/delete', ensureLoggedIn, gamesCtrl.delete);

module.exports = router;