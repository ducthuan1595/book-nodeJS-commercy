const express = require('express');

const authController = require('../../controller/auth.controller');
const {protect} = require('../../middleware/auth.middleware')

const router = express.Router();

router.post("/user/login", authController.login);
router.get('/credential-google', authController.credential)
router.post("/admin/login", authController.loginAdmin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/signup", authController.signup);

router.post('/refresh-token', authController.refreshToken);

router.put(
    "/update-user",
    protect,
    authController.updateUser
);
router.put('/avatar', protect, authController.updateAvatar);

router.get("/get-user", protect, authController.getUser);


module.exports = router;