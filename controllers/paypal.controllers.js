const axios = require("axios");

// Credenciales de PayPal
const PAYPAL_CLIENT_ID =
  "AdtLj3iCkwgMq6Fr4voXtHvnOW8wB63yvbSy1A78cB0gyGzzh6T1Gn0h1RS999V3TRf1agUXMOMzIQb-";
const PAYPAL_SECRET =
  "EJCX1U2asl06GY2OdiPvixJPeI4AvcifnY3Un5CUg9Du4KSQoZwlG_uv3evj8ioEpqapKQpJh1f4-P-M";

// Función para crear un pedido de PayPal
const createOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    // Autenticación con PayPal para obtener el token de acceso
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
      "base64"
    );

    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "CAD",
              value: amount,
            },
          },
        ],
        application_context: {
          brand_name: "FastVoiture",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: "https://192.168.112.1:3000/paypal/success",
          cancel_url: "https://192.168.112.1:3000/paypal/cancel",
        },
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extraer la URL de aprobación de PayPal
    const approvalUrl = response.data.links.find(
      (link) => link.rel === "approve"
    ).href;
    res.json({ approvalUrl, orderId: response.data.id });
  } catch (error) {
    console.error(
      "Erreur lors de la création de la commande PayPal:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la commande PayPal" });
  }
};

//Capturar orden de PayPal y actualizar estado en la base de datos
const captureOrder = async (req, res) => {
  const { orderId, reservationId } = req.body;

  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
      "base64"
    );

    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Confirmamos que el pago fue exitoso
    res.json({ status: "success", details: response.data });
  } catch (error) {
    console.error(
      "Error al capturar la orden de PayPal:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      status: "error",
      message: "Error al capturar la orden de PayPal",
    });
  }
};

module.exports = {
  createOrder,
  captureOrder,
};
