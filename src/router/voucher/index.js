"use strict";

const express = require("express")

const {
  getAllVoucher,
  createVoucher,
  updateVoucher,
  publishedVoucher,
  unpublishedVoucher,
  deleteVoucher
} = require("../../controller/voucher.controller");
const { protect } = require("../../middleware/auth.middleware");
const { asyncHandler } = require("../../support/asyncHandle");

const router = express.Router();

router.get("", asyncHandler(getAllVoucher))

router.use(protect);

router.post("", asyncHandler(createVoucher))
router.put("/published/:id", asyncHandler(publishedVoucher))
router.put("/unpublished/:id", asyncHandler(unpublishedVoucher))
router.put("/:id", asyncHandler(updateVoucher))
router.delete("/:id", asyncHandler(deleteVoucher))

module.exports = router;
