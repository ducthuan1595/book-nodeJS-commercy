const express = require('express');
const route = express.Router();

const {confirm, confirmPassword} = require('../controller/auth.controller');

route.get("/confirm", confirm);
route.post("/confirm-password", confirmPassword);

route.use('/api/v2', require('./v2/user.router'));
route.use('/api/v2', require('./v2/item.router'));
route.use('/api/v2', require('./v2/category.router'));
route.use('/api/v2', require('./v2/flashsale.router'));
route.use('/api/v2', require('./v2/voucher.router'));
route.use('/api/v2', require('./v2/order.router'));
route.use('/api/v2', require('./v2/review.router'));
route.use('/api/v2', require('./v2/stripe.router'));
route.use('/api/v2', require('./v2/otp.router'));



module.exports = route;