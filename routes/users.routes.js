//External imports
const express = require("express");

//Internal imports
const userControllers = require("../controllers/users.controllers");

//Variables
const router = express.Router();

// Route pour users
router.route("").get(userControllers.getAllUsers);
router.route("/:email").get(userControllers.getUserByEmail);

// Ruta para registrar un usuario
router.route("/register").post(userControllers.register);

// Ruta para iniciar sesión
router.route("/login").post(userControllers.login);

// Ruta para actualizar un usuario
router.route("/update/:email").put(userControllers.updateUser); // Nueva ruta para actualizar usuario

// Ruta para registrar reconocimiento facial
router.route("/users/registerFace").post(userControllers.registerFace);

// Ruta para registrar reconocimiento vocal
router.route("/users/registerVoice").post(userControllers.registerVoice);

//Exports
module.exports = router;
