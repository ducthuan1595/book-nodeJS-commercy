"use strict";

const express = require("express");

const {
  createOrder,
  getOrder,
  getRevenue,
} = require("../../controller/order.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/get-revenue-month", getRevenue);

router.use(protect);

router.post("", createOrder);

router.get("", getOrder);

module.exports = router;
