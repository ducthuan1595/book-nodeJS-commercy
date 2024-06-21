const express = require('express');

const {getReview, getReviewWithItem, updateReview, getAllReview, createReview} = require('../../controller/review.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post(
    "/review",
    protect,
    createReview
);
router.get('/review', protect, getReview);
router.get(
"/reviews",
getAllReview
);
router.get("/reviews-with-item", getReviewWithItem);
router.put(
"/review",
protect,
updateReview
);

module.exports = router;