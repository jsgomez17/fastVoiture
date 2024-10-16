//External imports
const express = require("express");

//Internal imports
const meControllers = require("../controllers/me.controllers");

//Router
const router = express.Router();

//Routes
router
  .route("")
  .get(meControllers.getMe)
  .put(meControllers.updateMe)
  .delete(meControllers.deleteMe);

//Exports
module.exports = router;
