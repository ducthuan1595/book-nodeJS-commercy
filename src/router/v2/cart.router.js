const express = require('express');

const {addCart, deleteCart} = require('../../controller/cart.controller');

const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post("/add-cart", protect, addCart);
router.delete(
  "/delete-cart",
  protect,
  deleteCart
);

module.exports = router;