const express = require("express");
const Voiture = require("../models/Voiture");
const Configuracion = require("../models/Configuration");
const router = express.Router();

router.post("/calculer-prix", async (req, res) => {
  const { distance } = req.body;

  try {
    const voitures = await Voiture.find();
    const configuration = await Configuracion.findOne();

    if (
      !voitures ||
      !configuration ||
      isNaN(Number(configuration.base_value))
    ) {
      return res.status(404).json({
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
    res.status(500).json({ error: "Erreur lors du calcul du prix" });
  }
});

module.exports = router;
