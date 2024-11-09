const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservaSchema = new mongoose.Schema({
  idcourse: { type: String, required: true },
  date: { type: Date, required: [true, "Date is required"] },
  address_depart: { type: String, required: [true, "Depart is required"] },
  address_destination: {
    type: String,
    required: [true, "Destination is required"],
  },
  type_vehicule: {
    type: String,
    required: [true, "Type of Vehicule is required"],
  },
  capacity: { type: Number, required: [true, "Capacity is required"] }, // Nuevo campo para capacidad
  prix: { type: Number, required: [true, "Price is required"] },
  id_usuario: { type: String, required: true },
  estado: {
    type: String,
    enum: ["reservado pour plus tard", "en course", "Finish"],
    required: [true, "Status is required"],
  },
});

module.exports = mongoose.model("Reserva", reservaSchema);
