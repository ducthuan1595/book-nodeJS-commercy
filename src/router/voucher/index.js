"use strict";

const express = require("express");

const {
  getVoucher,
  createVoucher,
} = require("../../controller/voucher.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("", getVoucher);

router.use(protect);

router.post("", createVoucher);

module.exports = router;
