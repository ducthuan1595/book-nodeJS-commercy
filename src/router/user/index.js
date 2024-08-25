'use strict'

const express = require('express');

const {
    updateAvatar,
    updateUser,
    getUser,
    changePassword
} = require('../../controller/user.controller');
const {protect} = require('../../middleware/auth.middleware')
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.use(protect)

router.put(
    "/update-user",
    asyncHandler(updateUser)
);
router.put('/avatar', asyncHandler(updateAvatar));
router.put('/change-password', asyncHandler(changePassword));

router.get("", asyncHandler(getUser));
router.get('/refresh-token', asyncHandler(refreshToken));

module.exports = router;