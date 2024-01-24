const express = require("express");

const authMiddleware = require("../middleware/auth");
const cronJobs = require("../serverless/cron");

const authController = require("../controller/auth");
const categoryController = require("../controller/category");
const itemController = require("../controller/item");
const cartController = require("../controller/cart");
const orderController = require("../controller/order");
const voucherController = require("../controller/voucher");
const flashsaleController = require("../controller/flashsale");
const reviewController = require('../controller/review');
const helpFile = require("../config/file");
const handlerFile = require("../suports/handleFile");

const router = express.Router();

const init = (app) => {
  router.get("/confirm", authController.confirm);
  router.post("/confirm-password", authController.confirmPassword);

  router.post("/api/login", authController.login);
  router.post("/api/login-admin", authController.loginAdmin);
  router.post("/api/forgot-password", authController.forgotPassword);
  router.post("/api/signup", authController.signup);

  router.post(
    "/api/update-user",
    authMiddleware.protect,
    authController.updateUser
  );

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
  router.post(
    "/api/update-item",
    authMiddleware.protect,
    itemController.updateItem
  );
  router.post(
    "/api/delete-item",
    authMiddleware.protect,
    itemController.deleteItem
  );
  router.get("/api/get-item", itemController.getAllItem);
  router.get("/api/get-item-flashsale", itemController.getAllItemFlashSale);
  router.get("/api/get-item-follow-price", itemController.getItemFollowPrice);

  // add cart;
  router.post("/api/add-cart", authMiddleware.protect, cartController.addCart);
  router.post(
    "/api/delete-cart",
    authMiddleware.protect,
    cartController.deleteCart
  );

  // order
  router.post(
    "/api/create-order",
    authMiddleware.protect,
    orderController.createOrder
  );

  router.get(
    "/api/get-order",
    authMiddleware.protect,
    orderController.getOrder
  );

  // voucher and flashsale
  router.post(
    "/api/create-voucher",
    authMiddleware.protect,
    voucherController.createVoucher
  );
  router.get("/api/get-voucher", voucherController.getVoucher);
  router.post(
    "/api/create-flashsale",
    authMiddleware.protect,
    // cronJobs
    flashsaleController.createFlashsale
  );
  router.get(
    "/api/get-flashsale",
    authMiddleware.protect,
    flashsaleController.getFlashSale
  );
  router.get("/api/get-user", authMiddleware.protect, authController.getUser);

  // Review
  router.post(
    "/api/v2/review",
    authMiddleware.protect,
    reviewController.createReview
  );

  router.get('/api/v2/review', authMiddleware.protect, reviewController.getReview);
  router.put(
    "/api/v2/review",
    authMiddleware.protect,
    reviewController.updateReview
  );

  // router.get("/api/image/:imageUrl", helpFile.sendImage);
  // router.get("/api/image/:imageUrl", handlerFile.sendImage);

  return app.use("/", router);
};

module.exports = init;
