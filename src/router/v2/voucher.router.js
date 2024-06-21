const express = require('express');

const {getVoucher, createVoucher} = require('../../controller/voucher.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post(
    "/create-voucher",
    protect,
    createVoucher
);
router.get("/get-voucher", getVoucher);

module.exports = router;