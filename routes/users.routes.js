//External imports
const express = require("express");

//Internal imports
const userControllers = require("../controllers/users.controllers");

//Variables
const router = express.Router();

// Route pour users
router.route("").get(userControllers.getAllUsers);
router.route("/:email").get(userControllers.getUserByEmail);

router.route("/register").post(userControllers.register);

router.route("/login").post(userControllers.login);

//Exports
module.exports = router;
