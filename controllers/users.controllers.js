//Internal imports
const User = require("../models/User");
const authUtils = require("../utils/auth.utils");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    // Verificar la autenticación
    const isTokenValid = authUtils.protect(req);

    if (isTokenValid === false) {
      return res.status(401)
        .send(`401 Unauthorized : Si l'ulisateur n'est pas authentifié ou si le token est
        invalide`);
    }
    // Obtener la lista de usuarios registrados
    const user = await User.find().select(
      "nom prenom telephone email password role"
    );
    return res.send(user);
  } catch (error) {
    return res.status(500).send(`Une erreur s'est user` + error);
  }
};

// Ruta para registrar un usuario
exports.register = async (req, res) => {
  const { nom, prenom, telephone, email, password, role } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "l'utilisateur est déjà enregistré" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nom,
      prenom,
      telephone,
      email,
      password: hashedPassword,
      role,
    });

    User.create(newUser);
    res.status(201).json("utilisateur enregistré");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Autenticación y Generación de Token JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por correo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "L'utilisateur n'existe pas, veuillez vous inscrire.",
      });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Devolver los datos del usuario, incluyendo el nombre y apellido
    res.status(200).json({
      message: "Connexion réussie",
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint para buscar un usuario por email
exports.getUserByEmail = async (req, res) => {
  const email = req.params.email; // Obtener el email de la query
  console.log(`searching email : ${email}`);
  try {
    const filter = { email: email };
    const user = await User.findOne(filter); // Buscar el usuario en la base de datos
    if (!user) {
      return res.status(404).send("Utilisateur introuvable"); // Si no se encuentra, retornar 404
    }
    res.status(200).send(user); // Retornar el usuario encontrado
  } catch (error) {
    res.status(500).send(error.message); // Manejar errores
  }
};
