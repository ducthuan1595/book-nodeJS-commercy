"use strict";

const express = require("express");

const {
  createFlashSaleByAdmin,
  updateFlashSale,
  addProductToFlashSale,
  getAllFlashSale
} = require("../../controller/flashsale.controller")
const { asyncHandler } = require('../../support/asyncHandle')
const { protect } = require("../../middleware/auth.middleware")

const router = express.Router();

router.get('', asyncHandler(getAllFlashSale))

router.use(protect)

router.post("", asyncHandler(createFlashSaleByAdmin))
router.put("/:id", asyncHandler(updateFlashSale))
router.patch("/:id", asyncHandler(addProductToFlashSale))

module.exports = router;
