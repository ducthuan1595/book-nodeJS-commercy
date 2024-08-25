'use strict'

const express = require('express');

const {
    login,
    credential,
    forgotPassword,
    signup,
    refreshToken,
} = require('../../controller/auth.controller');
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.post("/login", asyncHandler(login));
router.post("/signup", asyncHandler(signup));
router.get('/credential-google', asyncHandler(credential))
router.post("/forgot-password", asyncHandler(forgotPassword));

module.exports = router;