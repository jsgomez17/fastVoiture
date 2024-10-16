//Internal imports
const authUtils = require("../utils/auth.utils");
const User = require("../models/Users");

//Fonction Get me
exports.getMe = (req, res) => {
  const isProtect = authUtils.protect(req);
  if (!isProtect) {
    return res.status(401).send("No authorize to access this route");
  }

  const user = User.findById(req.userId);
  res.status(200).send("Successfully completed");
};

//Fonction Update - put me
exports.updateMe = (req, res) => {
  const { username, email, password } = req.body;
  const isProtect = authUtils.protect(req);
  if (!isProtect) {
    return res.status(401).send("No authorize to access this route");
  }
  const userId = req.userId;
  const userEmail = User.findByEmail(email);
  if (userEmail !== null) {
    return res
      .status(409)
      .send(
        `409 Conflict : Si l'adresse e-mail est déjà ulisée par un autre ulisateur.`
      );
  }
  User.update(userId, req.body);
  res.send(`Update a single user with id: ${userId}`);
};

//Fonction Delete - me
exports.deleteMe = (req, res) => {
  const isProtect = authUtils.protect(req);
  if (!isProtect) {
    return res.status(401).send("No authorize to access this route");
  }

  const user = User.DeleteById(req.userId);
  res.status(204).send("No content");
};
