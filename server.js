const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes"); // Importa las rutas de usuario

const app = express();
app.use(express.json());

const mongoURI =
  "mongodb+srv://adminFastVoiture:BJ61wSXO9jYEHDOt@cluster0.44esk.mongodb.net/fastVoiture?retryWrites=true&w=majority";

// Conectar a la base de datos MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Base de datos conectada a MongoDB Atlas"))
  .catch((err) => console.error("Error al conectar a la base de datos", err));

// Usar las rutas de usuario
app.use("/api/users", userRoutes); // Prefijo para las rutas de usuario

// Iniciar el Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
