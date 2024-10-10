const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["passenger", "driver"], required: true }, // Campo para almacenar el rol
});

// Exportar el modelo
module.exports = mongoose.model("User", userSchema);
