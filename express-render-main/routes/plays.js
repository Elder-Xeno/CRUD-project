const express = require("express");
const router = express.Router();
const playsCtrl = require("../controllers/plays");
const ensureLoggedIn = require("../config/ensureLoggedIn");

// Render play log form for a specific game
router.get("/:id/log", ensureLoggedIn, playsCtrl.renderPlayLogForm);

// Submit the play log form
router.post('/logPlay', ensureLoggedIn, playsCtrl.logPlay);

// Get play logs for a specific game
router.get("/:id/plays", ensureLoggedIn, playsCtrl.getPlayLogs);

// Render play log form for adding a play to a game not in the collection
router.get("/log", ensureLoggedIn, playsCtrl.renderGenericPlayLogForm);

// Render the view for displaying game logs
router.get("/playLogs", ensureLoggedIn, playsCtrl.renderAllPlayLogs);

// Update a play log
// router.put('/:id/plays/:playId', ensureLoggedIn, playsCtrl.update);

// Delete a play log
// router.delete('/:id/plays/:playId', ensureLoggedIn, playsCtrl.delete);

module.exports = router;
