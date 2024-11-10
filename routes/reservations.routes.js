//External imports
const express = require("express");

//Internal imports
const reservationControllers = require("../controllers/reservations.controllers");

//Variables
const router = express.Router();

// Route pour users
router.route("").get(reservationControllers.getAllReservations);

router.route("/reserver").post(reservationControllers.reserver);

// Nueva ruta para actualizar el estado de una reserva
router.route("/update-status").patch(reservationControllers.updateStatus);

router.get(
  "/:reservationId/details",
  reservationControllers.getReservationDetails
);

//Exports
module.exports = router;
