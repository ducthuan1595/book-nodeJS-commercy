"use strict";

const express = require("express");

const { verifyOtp, sendAgainOtp } = require("../../controller/otp.controller");
const limiterApi = require("../../middleware/limiter.middleware");
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.use(limiterApi);

router.post("/verify-otp", asyncHandler(verifyOtp));

router.post("/send-otp-again", asyncHandler(sendAgainOtp));

module.exports = router;
