const express = require("express");
const router = express.Router();
const playsCtrl = require("../controllers/plays");
const ensureLoggedIn = require("../config/ensureLoggedIn");

// Render play log form for a specific game
router.get("/:id/log", ensureLoggedIn, playsCtrl.renderPlayLogForm);

router.post("/logPlay", ensureLoggedIn, playsCtrl.logPlay);

router.get("/:id/plays", ensureLoggedIn, playsCtrl.getPlayLogs);

router.get("/log", ensureLoggedIn, playsCtrl.renderGenericPlayLogForm);

router.get("/playLogs", ensureLoggedIn, playsCtrl.renderAllPlayLogs);

router.get("/:id/edit", ensureLoggedIn, playsCtrl.edit);

router.put("/:id", ensureLoggedIn, playsCtrl.update);

router.post("/:id/delete", ensureLoggedIn, playsCtrl.delete);

module.exports = router;
