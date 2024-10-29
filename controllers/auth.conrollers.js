//External imports
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Internal imports
const { sign } = require("jsonwebtoken");
const User = require("../models/Users");

// Función auxiliar para validar email
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

exports.login = async (req, res) => {
  try {
    //Recover email and password body
    console.log("Iniciando proceso de login");
    console.log("Body recibido:", req.body);
    const { email, password } = req.body;

    //verify email and password aren't empty
    if (email === undefined || email.trim() === "") {
      return res
        .status(400)
        .send(
          `400 Bad Request: Si des parametres sont manquants ou invalides.`
        );
    }

    if (password === undefined || password.trim() === "") {
      return res
        .status(400)
        .send(
          `400 Bad Request: Si des parametres sont manquants ou invalides.`
        );
    }
    //search user with email of body
    const user = User.findOne({ email });
    console.log("Usuario encontrado: ", user); // Añade esta línea

    if (user === null || user.password === null) {
      return res
        .status(401)
        .send(
          `401 Unauthorized: Si l'adresse e-mail ou le mot de passe est incorrect.`
        );
    }

    // Comparar passwords usando bcrypt.compare
    const isValidPassword = await bcrypt.compare(password, user.password || "");

    if (!isValidPassword) {
      return res
        .status(401)
        .send(`401 Unauthorized: Email o password incorrectos`);
    }

    //Generate a token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "FastVoiture2024"
    );

    res.status(200).send(`Login exitoso,
      ${token}`);

    res.send(token);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).send("Error interno del servidor");
  }
};

exports.register = async (req, res) => {
  try {
    //Recover user, email and password body
    const { nom, prenom, telephone, email, password, role } = req.body;

    // Validaciones
    const requiredFields = { nom, prenom, telephone, email, password, role };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value.trim() === "") {
        return res.status(400).send(`400 Bad Request: ${field} es requerido`);
      }
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("409 Conflict: El email ya está registrado");
    }

    // encryptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con password hasheado
    const userData = {
      nom,
      prenom,
      telephone,
      email,
      password: hashedPassword,
      role,
    };

    const newUser = await User.create(userData);

    if (nom === undefined || nom.trim() === "") {
      return res
        .status(400)
        .send(
          `400 Bad Request : Si des paramètres sont manquants ou invalides.`
        );
    }
    if (prenom === undefined || prenom.trim() === "") {
      return res
        .status(400)
        .send(
          `400 Bad Request : Si des paramètres sont manquants ou invalides.`
        );
    }
    if (telephone === undefined || telephone.trim() === "") {
      return res
        .status(400)
        .send(
          `400 Bad Request : Si des paramètres sont manquants ou invalides.`
        );
    }
    if (email === undefined || email.trim() === "") {
      return res
        .status(400)
        .send(
          `400 Bad Request : Si des paramètres sont manquants ou invalides.`
        );
    }
    if (password === undefined || password.trim() === "") {
      return res
        .status(400)
        .send(
          `400 Bad Request : Si des paramètres sont manquants ou invalides.`
        );
    }
    if (role === undefined || role.trim() === "") {
      return res
        .status(400)
        .send(
          `400 Bad Request : Si des paramètres sont manquants ou invalides.`
        );
    }

    //Check if the user already exists
    existingUser = User.findOne(email);
    if (existingUser != null) {
      return res
        .status(409)
        .send(
          "409 Conflict : Si l'adresse e-mail est déjà u􀆟lisée par un autre u􀆟lisateur."
        );
    }

    await User.create(req.body);

    const token = jwt.sign({ id: newUser.id }, "FastVoiture2024");

    return res.send(`Successfully created with token ${token}`);
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).send("Error interno del servidor");
  }
};

exports.update = async (req, res) => {
  try {
    await User.update(req.body);
    return res.send("Successfully Updated");
  } catch (error) {
    console.error("Error en update:", error);
    res.status(500).send("Error interno del servidor");
  }
};
