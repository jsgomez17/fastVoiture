//Internal imports
const Reservation = require("../models/Reservation");
const authUtils = require("../utils/auth.utils");

exports.getAllReservations = async (req, res) => {
  try {
    // Verificar la autenticación
    const isTokenValid = authUtils.protect(req);

    if (isTokenValid === false) {
      return res.status(401)
        .send(`401 Unauthorized : Si l'ulisateur n'est pas authentifié ou si le token est
          invalide`);
    }
    // Obtener la lista de usuarios registrados
    const reservation = await Reservation.find().select(
      "nom prenom telephone email password role"
    );
    return res.send(reservation);
  } catch (error) {
    return res.status(500).send(`Une erreur s'est user` + error);
  }
};

exports.reserver = async (req, res) => {
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
};

// Controlador para actualizar el estado de la reserva
exports.updateStatus = async (req, res) => {
  const { reservationId, status } = req.body; // Obtén el ID de la reserva y el nuevo estado del cuerpo de la solicitud

  try {
    // Actualiza el estado de la reserva
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { estado: status },
      { new: true } // Esto devuelve el documento actualizado
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json({
      message: "Estado de la reserva actualizado",
      updatedReservation,
    });
  } catch (error) {
    console.error("Error al actualizar el estado de la reserva:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el estado de la reserva" });
  }
};

exports.getReservationDetails = async (req, res) => {
  const { reservationId } = req.params;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    res.json(reservation);
  } catch (error) {
    console.error(
      "Erreur lors de l'obtention des détails de la réservation:",
      error
    );
    res.status(500).json({
      message: "Erreur lors de l'obtention des détails de la réservation",
    });
  }
};
