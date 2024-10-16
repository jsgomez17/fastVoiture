//External imports
const express = require("express");

//Internal imports
const userControllers = require("../controllers/users.controllers");

/* Codigo de Jenny
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/Users"); // Importa el modelo de usuario
*/

//Variables
const router = express.Router();

router
  .route("")
  .get(userControllers.getAllUsers)
  .post(userControllers.createSingleUser);

router
  .route("/:id")
  .get(userControllers.getSingleUser)
  .put(userControllers.updateSingleUser)
  .delete(userControllers.deleteSingleUser);

//Exports
module.exports = router;

// // Ruta para registrar un usuario <--- codigo de Jenny
// router.post("/register", async (req, res) => {
//   const { nom, prenom, telephone, email, password, role } = req.body;

//   try {
//     // Verificar si el usuario ya existe
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "El usuario ya existe" });
//     }

//     // Encriptar la contraseña
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       nom,
//       prenom,
//       telephone,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Autenticación y Generación de Token JWT
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Buscar el usuario por correo
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         message: "L'utilisateur n'existe pas, veuillez vous inscrire.",
//       });
//     }

//     // Verificar la contraseña
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ message: "Email ou mot de passe incorrect" });
//     }

//     // Devolver los datos del usuario, incluyendo el nombre y apellido
//     res.status(200).json({
//       message: "Connexion réussie",
//       nom: user.nom,
//       prenom: user.prenom,
//       email: user.email,
//       role: user.role,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Endpoint para buscar un usuario por email
// router.get("/getUserByEmail", async (req, res) => {
//   const { email } = req.query; // Obtener el email de la query

//   try {
//     const user = await User.findOne({ email }); // Buscar el usuario en la base de datos
//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur introuvable" }); // Si no se encuentra, retornar 404
//     }
//     res.status(200).json({ user }); // Retornar el usuario encontrado
//   } catch (error) {
//     res.status(500).json({ message: error.message }); // Manejar errores
//   }
// });
// module.exports = router;
