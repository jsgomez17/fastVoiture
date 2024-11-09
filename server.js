//External imports
const express = require("express");
const mongoose = require("mongoose");
const os = require("os"); // Importa el módulo os para saber el ip de localhost.

//Internal imports
const usersRoutes = require("./routes/users.routes");
const voituresRoutes = require("./routes/voitures.routes");
const reservationRoutes = require("./routes/reservations.routes");

//Variables
const app = express();
const PORT = 3000;
const URL_BDD =
  //"mongodb+srv://dev:B1yWZQPOTdpVl1OX@cluster0.44esk.mongodb.net/fastVoiture"; //Link de Atlas MongoDB
  "mongodb+srv://adminFastVoiture:BJ61wSXO9jYEHDOt@cluster0.44esk.mongodb.net/fastVoiture?retryWrites=true&w=majority";

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
    const connectdb = await mongoose.connect(URL_BDD);
    console.log(`db connect to : ${connectdb.connection.host}`);
  } catch (error) {
    console.log(`Error mongoDb : ${error}`);
  }
};
connect();

//Body parser
app.use(express.json());

//Router
app.use("/users", usersRoutes);
app.use("/voitures", voituresRoutes);
app.use("/reservations", reservationRoutes);

//Listener
app.listen(PORT, () => {
  const localIP = getLocalIP(); // Obtén la IP local
  console.log(`Server listen on port: http://${localIP}:${PORT}`);
});
