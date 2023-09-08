const express = require("express");

const authController = require("../controller/auth");
const categoryController = require("../controller/category");
const authMiddleware = require("../middleware/auth");
const itemController = require("../controller/item");

const router = express.Router();

const init = (app) => {
  router.get("/confirm", authController.confirm);

  router.post("/api/login", authController.login);
  router.post("/api/signup", authController.signup);

  // Category
  router.get("/api/get-all-category", categoryController.getAllCategory);
  router.post(
    "/api/create-category",
    authMiddleware.protect,
    categoryController.createCategory
  );
  router.post(
    "/api/update-category",
    authMiddleware.protect,
    categoryController.updateCategory
  );
  router.post(
    "/api/delete-category",
    authMiddleware.protect,
    categoryController.deleteCategory
  );

  // Items
  router.post(
    "/api/create-item",
    authMiddleware.protect,
    itemController.createItem
  );

  return app.use("/", router);
};

module.exports = init;
