const express = require('express');

const authController = require('../../controller/auth.controller');
const {addCart, deleteCart} = require('../../controller/cart.controller');
const {protect} = require('../../middleware/auth.middleware')

const router = express.Router();

router.post("/login", authController.login);
router.get('/credential', authController.credential)
router.post("/login-admin", authController.loginAdmin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/signup", authController.signup);

router.post('/refresh-token', authController.refreshToken);

router.post(
    "/update-user",
    protect,
    authController.updateUser
);
router.put('/avatar', protect, authController.updateAvatar);

router.get("/get-user", protect, authController.getUser);

// Cart //
router.post("/add-cart", protect, addCart);
router.post(
  "/delete-cart",
  protect,
  deleteCart
);

module.exports = router;