const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: [true, "Nom is required"] },
  prenom: { type: String, required: [true, "Prenom is required"] },
  telephone: { type: String, required: [true, "telephone is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  role: {
    type: String,
    enum: ["passenger", "driver"],
    required: [true, "The role is required"],
  }, // Campo para almacenar el rol
});

// Exportar el modelo
module.exports = mongoose.model("User", userSchema, "users");
