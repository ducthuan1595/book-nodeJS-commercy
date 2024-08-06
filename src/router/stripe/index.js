'use strict'

const express = require('express');

const {getPublishKey, createPayment} = require('../../controller/stripe.controller');
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.get("/config-stripe",asyncHandler(getPublishKey));

router.post('/create-payment-intent', asyncHandler(createPayment))


module.exports = router;