//Internal imports
const Voiture = require("../models/Voiture");
const authUtils = require("../utils/auth.utils");
const Configuracion = require("../models/Configuration");
const bcrypt = require("bcryptjs");

exports.getAllVoitures = async (req, res) => {
  try {
    // Verificar la autenticación
    const isTokenValid = authUtils.protect(req);

    if (isTokenValid === false) {
      return res.status(401)
        .send(`401 Unauthorized : Si l'ulisateur n'est pas authentifié ou si le token est
        invalide`);
    }
    // Obtener la lista de usuarios registrados
    const voiture = await Voiture.find().select(
      "capacity base_price per_km_rate"
    );
    return res.send(voiture);
  } catch (error) {
    return res.status(500).send(`Une erreur s'est voiture` + error);
  }
};

// Ruta para actulizar precios
exports.calculPrix = async (req, res) => {
  const { distance } = req.body;

  try {
    const voitures = await Voiture.find();
    const configuration = await Configuracion.findOne();

    if (
      !voitures ||
      !configuration ||
      isNaN(Number(configuration.base_value))
    ) {
      return res.status(404).send({
        error:
          "Vehicules ou configuration non trouvés ou base_value non valide",
      });
    }

    // Calcular el precio para cada vehículo con conversión explícita a número
    const baseValue = Number(configuration.base_value);

    const voituresAvecPrix = voitures.map((voiture) => {
      const basePrice = Number(voiture.base_price);
      const perKmRate = Number(voiture.per_km_rate);

      const prix = baseValue + basePrice + perKmRate * distance;
      return {
        id: voiture._id,
        type: voiture.type,
        capacity: voiture.capacity,
        price: prix.toFixed(2) + " $CA",
        eta: voiture.eta,
        image: voiture.image,
      };
    });

    res.json(voituresAvecPrix);
  } catch (error) {
    console.error(
      "Erreur lors du calcul du prix pour tous les véhicules:",
      error
    );
    res.status(500).send("Erreur lors du calcul du prix");
  }
};
