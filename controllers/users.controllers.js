//Internal imports
const User = require("../models/Users");
const authUtils = require("../utils/auth.utils");

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
    return res.status(500).send(`Une erreur` + error);
  }
};

exports.getSingleUser = (req, res) => {
  const id = req.params.id;
  res.send(User.findById(id));
};

exports.createSingleUser = async (req, res) => {
  await User.create(req.body);
  res.send(`Successfully created`);
};

exports.updateSingleUser = (req, res) => {
  const isTokenValid = authUtils.protect(req);
  const id = req.params.id;

  if (isTokenValid === false) {
    return res.status(401)
      .send(`401 Unauthorized : Si l'ulisateur n'est pas authentifié, si le token est
        invalide ou n'a pas les droits d'accès administrateur.`);
  }
  const userId = req.userId;
  const usertemp = User.findById(userId);
  if (!usertemp.isAdmin) {
    return res.status(401)
      .send(`401 Unauthorized : Si l'ulisateur n'est pas authentifié, si le token est
        invalide ou n'a pas les droits d'accès administrateur.`);
  }
  const userUpdate = User.findById(id);
  if (!userUpdate) {
    return res
      .status(404)
      .send(`404 Not Found : Si l'ulisateur spécifié n'existe pas.`);
  }

  const userEmail = User.findByEmail(req.body.email);
  if (userEmail !== null) {
    return res
      .status(409)
      .send(
        `409 Conflict : Si l'adresse e-mail est déjà ulisée par un autre ulisateur.`
      );
  }

  User.update(id, req.body);
  res.send(`Update a single user with id: ${id}`);
};

exports.deleteSingleUser = (req, res) => {
  const isTokenValid = authUtils.protect(req);
  const id = req.params.id;
  if (isTokenValid === false) {
    return res.status(401)
      .send(`401 Unauthorized : Si l'u'lisateur n'est pas authentifié ou n'a pas les droits
        d'accès administrateur.`);
  }
  const userId = req.userId;
  const usertemp = User.findById(userId);
  if (!usertemp.isAdmin) {
    return res.status(401)
      .send(`401 Unauthorized : Si l'ulisateur n'est pas authentifié, si le token est
        invalide ou n'a pas les droits d'accès administrateur.`);
  }

  const userDelete = User.findById(id);
  if (!userDelete) {
    return res
      .status(404)
      .send(`404 Not Found : Si l'ulisateur spécifié n'existe pas.`);
  }

  User.DeleteById(id);
  res.send(`Delete single user with id: ${id}`);
};
