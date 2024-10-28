const express = require("express");
const Reservation = require("../models/Reservation"); // Asegúrate de tener el modelo de Reserva
const router = express.Router();

router.post("/reserver", async (req, res) => {
  const {
    idcourse,
    date,
    address_depart,
    address_destination,
    type_vehicule,
    capacity,
    prix,
    id_usuario,
    estado,
  } = req.body;

  try {
    const newReservation = new Reservation({
      idcourse,
      date,
      address_depart,
      address_destination,
      type_vehicule,
      capacity,
      prix,
      id_usuario,
      estado,
    });

    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la réservation" });
  }
});

module.exports = router;
