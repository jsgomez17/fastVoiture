//External importws
const express = require("express");
const mongoose = require("mongoose");

//Internal imports
const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const me = require("./routes/me.routes");

// Jenny: const userRoutes = require("./routes/users.routes"); Importa las rutas de usuario

//Variables
const app = express();
const PORT = 3000;

const connect = async () => {
  try {
    const connectdb = await mongoose.connect(
      "mongodb+srv://adminFastVoiture:BJ61wSXO9jYEHDOt@cluster0.44esk.mongodb.net/"
    );
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
app.use("/auth", authRoutes);
app.use("/me", me);

//Listener
app.listen(PORT, () => {
  console.log(`Server listen on port: ${PORT}`);
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
