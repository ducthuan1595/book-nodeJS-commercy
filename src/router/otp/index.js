"use strict";

const express = require("express");

const { verifyOtp, sendAgainOtp } = require("../../controller/otp.controller");
const limiterApi = require("../../middleware/limiter.middleware");

const router = express.Router();

router.use(limiterApi);

router.post("/verify-otp", verifyOtp);

router.post("/send-otp-again", sendAgainOtp);

module.exports = router;
