//External imports
const jwt = require("jsonwebtoken");

exports.protect = (req) => {
  try {
    //Recuperer le token
    let token = req.headers.authorization;

    //console.log(req.headers.authorization);
    //Valide que le token est de type Bearer
    if (!token.startsWith("Bearer")) {
      return false;
    }
    //Enlever le Bearer du token
    token = token.split(" ")[1];
    console.log(token);
    //Decoded token
    const decodedToken = jwt.decode(token, "FastVoiture2024");

    req.userId = decodedToken._id;

    return true;
  } catch (error) {
    return false;
  }
};
