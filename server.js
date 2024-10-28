//External importws
const express = require("express");
const mongoose = require("mongoose");
const os = require("os"); // Importa el módulo os

//Internal imports
const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const me = require("./routes/me.routes");

// Jenny: const userRoutes = require("./routes/users.routes"); Importa las rutas de usuario

//Variables
const app = express();
const PORT = 3000;

// Función para obtener la IP local
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address; // Retorna la IP que no es interna
      }
    }
  }
  return "localhost"; // En caso de que no se encuentre una IP
};

const connect = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://dev:B1yWZQPOTdpVl1OX@cluster0.44esk.mongodb.net/"
    );
    console.log(`db connect to : ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error mongoDb : ${error}`);
  }
};
connect();

//Body parser
app.use(express.json());

//Router
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/me", me);

//Listener
app.listen(PORT, () => {
  console.log(`Server listen on port: ${PORT}`);
  const localIP = getLocalIP(); // Obtén la IP local
  console.log(`Server is running on http://${localIP}:${PORT}`);
});

/* ***************************************Codigo de Jenny***************************************

const mongoURI =
  "mongodb+srv://adminFastVoiture:BJ61wSXO9jYEHDOt@cluster0.44esk.mongodb.net/fastVoiture?retryWrites=true&w=majority";

// Conectar a la base de datos MongoDB
const connect = async () => {
  const connectdb = await mongoose.connect(
    "mongodb+srv://adminFastVoiture:BJ61wSXO9jYEHDOt@cluster0.44esk.mongodb.net/"
  );

  console.log(`db connect to : ${connectdb.connection.host}`);
};
connect();

//console.log(`db connect to : ${connect.connectdb.connection.host}`);

// Usar las rutas de usuario
app.use("/api/users", userRoutes); // Prefijo para las rutas de usuario

// Iniciar el Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur exécuté dans le port ${PORT}`);
});
*/
