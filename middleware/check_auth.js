const jwt = require('jsonwebtoken');
const process = require('../config');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // смотри console.log(req.header.authorization), что бы понять, как мы отделяем токен в полученном массиве
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed!"
    });
  }

};
