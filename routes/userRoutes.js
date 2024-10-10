const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Importa el modelo de usuario

const router = express.Router();

// Registro de Usuarios
router.post("/register", async (req, res) => {
  const { nom, prenom, telephone, email, password, role } = req.body;

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    nom,
    prenom,
    telephone,
    email,
    password: hashedPassword,
    role,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Autenticación y Generación de Token JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
