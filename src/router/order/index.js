"use strict";

const express = require("express");

const {
  createOrder
} = require("../../controller/order.controller");
const { protect } = require("../../middleware/auth.middleware");
const { asyncHandler } = require("../../support/asyncHandle");

const router = express.Router();

// router.get("/get-revenue-month", getRevenue);

router.use(protect);

router.post("", asyncHandler(createOrder));

// router.get("", getOrder);

module.exports = router;
