const express = require('express');

const {getPublishKey, createPayment} = require('../../controller/stripe.controller');

const router = express.Router();

router.get("/config-stripe", getPublishKey);

router.post('/create-payment-intent', createPayment)


module.exports = router;