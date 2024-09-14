'use strict'

const express = require('express');

const {
    updateAvatar,
    updateUser,
    getInfoUser,
    changePassword,
    refreshToken,
    getAllUser,
    updatePermissionForUserWithAdmin
} = require('../../controller/user.controller');
const {protect} = require('../../middleware/auth.middleware')
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router()

router.use(protect)

router.get('/all', asyncHandler(getAllUser))

router.put(
    "",
    asyncHandler(updateUser)
);
router.put('/avatar', asyncHandler(updateAvatar));
router.put('/change-password', asyncHandler(changePassword))

router.get("", asyncHandler(getInfoUser));
router.get('/refresh-token', asyncHandler(refreshToken))
router.put('/permission/:id', asyncHandler(updatePermissionForUserWithAdmin))

module.exports = router;