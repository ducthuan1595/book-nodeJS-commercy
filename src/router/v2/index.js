const express = require('express');
const route = express.Router();

const {confirm, confirmPassword} = require('../../controller/auth.controller');

route.get("/confirm", confirm);
route.post("/confirm-password", confirmPassword);

route.use('/auth', require('./user.router'));
route.use('/product', require('./item.router'));
route.use('/category', require('./category.router'));
route.use('/flashsale', require('./flashsale.router'));
route.use('/voucher', require('./voucher.router'));
route.use('/order', require('./order.router'));
route.use('/review', require('./review.router'));
route.use('/stripe', require('./stripe.router'));
route.use('/otp', require('./otp.router'));



module.exports = route;