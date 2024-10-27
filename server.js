const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes"); // Importa las rutas de usuario
const voitureRoutes = require("./routes/voitureRoutes"); // Importa las rutas de vehiculo
const app = express();
app.use(express.json());

const mongoURI =
  "mongodb+srv://adminFastVoiture:BJ61wSXO9jYEHDOt@cluster0.44esk.mongodb.net/fastVoiture?retryWrites=true&w=majority";

// Conectar a la base de datos MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Base de données connectée à MongoDB Atlas"))
  .catch((err) =>
    console.error("Erreur de connexion à la base de données", err)
  );

// Usar las rutas de usuario
app.use("/api/users", userRoutes); // Prefijo para las rutas de usuario

// Usar las rutas de vehiculos
app.use("/api", voitureRoutes);

app.use("/public", express.static("public"));
// Iniciar el Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur exécuté dans le port ${PORT}`);
});
