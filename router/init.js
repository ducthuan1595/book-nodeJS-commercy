const express = require("express");

const authController = require("../controller/auth");

const router = express.Router();

const init = (app) => {
  router.post("/api/login", authController.login);
  router.post("/api/signup", authController.signup);

  return app.use("/", router);
};

module.exports = init;
