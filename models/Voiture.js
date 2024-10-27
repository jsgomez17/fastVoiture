const mongoose = require("mongoose");
const { string } = require("yup");

const voitureSchema = new mongoose.Schema({
  type: String,
  capacity: Number,
  base_price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  per_km_rate: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  eta: String,
  image: String,
});

module.exports = mongoose.model("Voiture", voitureSchema);
