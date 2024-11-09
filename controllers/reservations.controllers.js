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
