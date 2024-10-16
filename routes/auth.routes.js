//External imports
const express = require("express");

//Internal imports
const authControllers = require("../controllers/auth.conrollers");

//variables
const router = express.Router();

router.route("/login").post(authControllers.login);

router.route("/register").post(authControllers.register);

router.route("/update").put(authControllers.update);
//Exports
module.exports = router;
