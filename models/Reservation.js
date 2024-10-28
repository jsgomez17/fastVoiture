const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservaSchema = new mongoose.Schema({
  idcourse: { type: String, required: true },
  date: { type: Date, required: true },
  address_depart: { type: String, required: true },
  address_destination: { type: String, required: true },
  type_vehicule: { type: String, required: true },
  capacity: { type: Number, required: true }, // Nuevo campo para capacidad
  prix: { type: Number, required: true },
  id_usuario: { type: String, required: true },
  estado: {
    type: String,
    enum: ["reservado pour plus tard", "en course", "Finish"],
    required: true,
  },
});

module.exports = mongoose.model("Reserva", reservaSchema);
