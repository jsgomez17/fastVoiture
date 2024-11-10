//External imports
const express = require("express");

//Internal imports
const voitureControllers = require("../controllers/voitures.controllers");

//Variables
const router = express.Router();

// Route pour users
router.route("").get(voitureControllers.getAllVoitures);

router.route("/calculer-prix").post(voitureControllers.calculPrix);

//Exports
module.exports = router;
