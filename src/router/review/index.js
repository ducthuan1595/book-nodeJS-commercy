"use strict";

const express = require("express");

const {
  getReview,
  getReviewWithItem,
  updateReview,
  getAllReview,
  createReview,
} = require("../../controller/review.controller");
const { protect } = require("../../middleware/auth.middleware");
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.get("", asyncHandler(getAllReview));
router.get("/reviews-with-item", asyncHandler(getReviewWithItem));

router.use(protect);

router.post("", asyncHandler(createReview));
router.get("/:reviewId", asyncHandler(getReview));
router.put("/:reviewId", asyncHandler(updateReview));

module.exports = router;
