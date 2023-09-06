const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: "600s" });
};

module.exports = createToken;
