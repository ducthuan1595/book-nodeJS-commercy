'use strict'

const express = require('express');

const {
    updateAvatar,
    updateUser,
    getUser,
    changePassword,
    refreshToken
} = require('../../controller/user.controller');
const {protect} = require('../../middleware/auth.middleware')
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.use(protect)

router.put(
    "",
    asyncHandler(updateUser)
);
router.put('/avatar', asyncHandler(updateAvatar));
router.put('/change-password', asyncHandler(changePassword));

router.get("", asyncHandler(getUser));
router.get('/refresh-token', asyncHandler(refreshToken));

module.exports = router;