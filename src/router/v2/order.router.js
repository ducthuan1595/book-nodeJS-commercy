const express = require('express');

const {createOrder, getOrder, getRevenue} = require('../../controller/order.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post(
    "/create-order",
    protect,
    createOrder
);

router.get(
    "/get-order",
    protect,
    getOrder
);

router.get('/get-revenue-month', getRevenue)

module.exports = router;