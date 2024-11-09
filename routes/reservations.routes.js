//External imports
const express = require("express");

//Internal imports
const reservationControllers = require("../controllers/reservations.controllers");

//Variables
const router = express.Router();

// Route pour users
router.route("").get(reservationControllers.getAllReservations);

router.route("/reserver").post(reservationControllers.reserver);

//Exports
module.exports = router;
