//External imports
const jwt = require("jsonwebtoken");

//Internal imports
const { sign } = require("jsonwebtoken");
const User = require("../models/Users");

exports.login = (req, res) => {
  //Recover email and password body
  const email = req.body.email;
  const password = req.body.password;

  //verify email and password aren't empty
  if (email === undefined || email.trim() === "") {
    return res
      .status(400)
      .send(`400 Bad Request: Si des parametres sont manquants ou invalides.`);
  }

  if (password === undefined || password.trim() === "") {
    return res
      .status(400)
      .send(`400 Bad Request: Si des parametres sont manquants ou invalides.`);
  }
  //search user with email of body
  const user = User.findByEmail(email);
  if (user === null) {
    return res
      .status(401)
      .send(
        `401 Unauthorized: Si l'adresse e-mail ou le mot de passe est incorrect.`
      );
  }
  //compare password of user with password of body
  if (user.password !== password) {
    return res
      .status(401)
      .send(
        `401 Unauthorized: Si l'adresse e-mail ou le mot de passe est incorrect.`
      );
  }
  //Generate a token
  const token = jwt.sign({ id: user.id }, "FastVoiture2024");

  res.send(token);
};

exports.register = (req, res) => {
  //Recover user, email and password body
  const { nom, prenom, telephone, email, password, role } = req.body;

  if (nom === undefined || nom.trim() === "") {
    return res
      .status(400)
      .send(`400 Bad Request : Si des paramètres sont manquants ou invalides.`);
  }
  if (prenom === undefined || prenom.trim() === "") {
    return res
      .status(400)
      .send(`400 Bad Request : Si des paramètres sont manquants ou invalides.`);
  }
  if (telephone === undefined || telephone.trim() === "") {
    return res
      .status(400)
      .send(`400 Bad Request : Si des paramètres sont manquants ou invalides.`);
  }
  if (email === undefined || email.trim() === "") {
    return res
      .status(400)
      .send(`400 Bad Request : Si des paramètres sont manquants ou invalides.`);
  }
  if (password === undefined || password.trim() === "") {
    return res
      .status(400)
      .send(`400 Bad Request : Si des paramètres sont manquants ou invalides.`);
  }
  if (role === undefined || role.trim() === "") {
    return res
      .status(400)
      .send(`400 Bad Request : Si des paramètres sont manquants ou invalides.`);
  }

  //Check if the user already exists
  let existingUser = User.findByEmail(email);
  if (existingUser != null) {
    return res
      .status(409)
      .send(
        "409 Conflict : Si l'adresse e-mail est déjà u􀆟lisée par un autre u􀆟lisateur."
      );
  }

  User.create(req.body);
  const newUser = User.findByEmail(email);
  const token = jwt.sign({ id: newUser.id }, "FastVoiture2024");
  return res.send(`Successfully created with token ${token}`);
};

exports.update = (req, res) => {
  User.update(req.body);
  return res.send("Successfully Updated");
};
