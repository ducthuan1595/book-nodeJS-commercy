"use strict";

const express = require("express");

const {
  createOrder,
  getOrderByUser,
  getOrderByShop,
  getOrderByAdmin,
  getOrderByProduct,
  changeOrderStatus,
  cancelOrder
} = require("../../controller/order.controller");
const { protect } = require("../../middleware/auth.middleware");
const { asyncHandler } = require("../../support/asyncHandle");

const router = express.Router();

router.use(protect);

router.post("", asyncHandler(createOrder));

router.get("/user", asyncHandler(getOrderByUser));
router.get("/shop/:shopId", asyncHandler(getOrderByShop));
router.get("/admin", asyncHandler(getOrderByAdmin));
router.get("/product/:productId", asyncHandler(getOrderByProduct));
router.put("/:orderId/status", asyncHandler(changeOrderStatus));
router.put("/:orderId/cancel", asyncHandler(cancelOrder));

module.exports = router;
