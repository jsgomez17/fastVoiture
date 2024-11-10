const mongoose = require("mongoose");
const { string } = require("yup");

const voitureSchema = new mongoose.Schema({
  type: String,
  capacity: Number,
  base_price: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, "Price is required"],
  },
  per_km_rate: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, "Rate is required"],
  },
  eta: String,
  image: String,
});

module.exports = mongoose.model("Voiture", voitureSchema);
