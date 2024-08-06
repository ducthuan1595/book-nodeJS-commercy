"use strict";

const express = require("express");

const {
  getFlashSale,
  createFlashsale,
} = require("../../controller/flashsale.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("", getFlashSale);

router.post("", createFlashsale);

module.exports = router;
