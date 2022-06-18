const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const { ACCESS_TOKEN_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next(); //allow the request to continue
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN'
    const isCustomAuth = token.length < 500; //> 500 = Google auth
    if (!token) {
      return res.json({
        msg: "Authentication failed!",
      });
    }
    let decodedToken;
    if (isCustomAuth) {
      decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

      req.userData = { userId: decodedToken.userId }; //add data to request
    } else {
      decodedToken = jwt.decode(token);
      req.userData = { userId: decodedToken?.sub }; //add data to request
    }
    next(); //let the request continue
  } catch (err) {
    return res.json({
      msg: "Authentication failed!",
    });
  }
};
