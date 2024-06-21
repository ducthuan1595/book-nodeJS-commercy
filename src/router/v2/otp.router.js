const express = require('express');

const { verifyOtp, sendAgainOtp } = require('../../controller/otp.controller');
const limiterApi = require('../../middleware/limiter.middleware');

const router = express.Router();

router.post(
    "/verify-otp",
    limiterApi,
    verifyOtp
);

router.post('/send-otp-again', limiterApi, sendAgainOtp)


module.exports = router;