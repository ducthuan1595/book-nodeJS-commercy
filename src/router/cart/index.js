'use strict'

const express = require('express');

const {addCart, deleteCart} = require('../../controller/cart.controller');

const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(protect)

router.post("", addCart);
router.delete("", deleteCart);

module.exports = router;