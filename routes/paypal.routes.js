const express = require("express");
const paypalController = require("../controllers/paypal.controllers");

const router = express.Router();

// Ruta para crear un pedido de PayPal
router.post("/create-order", paypalController.createOrder);
router.post("/capture-order", paypalController.captureOrder);

module.exports = router;
