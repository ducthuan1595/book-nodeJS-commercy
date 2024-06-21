const express = require('express');

const {getFlashSale, createFlashsale} = require('../../controller/flashsale.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get(
    "/get-flashsale",
    protect,
    getFlashSale
);

router.post(
  "/create-flashsale",
  protect,
  // cronJobs
  createFlashsale
  );

module.exports = router;