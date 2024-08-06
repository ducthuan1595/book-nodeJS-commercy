'use strict'

const express = require('express');

const {
    login,
    credential,
    loginAdmin,
    forgotPassword,
    signup,
    refreshToken,
    updateAvatar,
    updateUser,
    getUser
} = require('../../controller/auth.controller');
const {protect} = require('../../middleware/auth.middleware')
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.post("/login", asyncHandler(login));
router.get('/credential-google', asyncHandler(credential))
router.post("/admin/login", asyncHandler(loginAdmin));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/signup", asyncHandler(signup));

router.post('/refresh-token', asyncHandler(refreshToken));

router.use(protect)

router.put(
    "/update-user",
    asyncHandler(updateUser)
);
router.put('/avatar', asyncHandler(updateAvatar));

router.get("", asyncHandler(getUser));


module.exports = router;