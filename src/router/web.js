// const router = require('express').Router();
// require('dotenv').config();

// const stripeController = require('../controller/stripe');

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2022-08-01",
// });

// const web = (app) => {

//   router.get("/api/v2/config-stripe", stripeController.getPublishKey);

//   router.post('/api/v2/create-payment-intent', stripeController.createPayment)

//   return app.use('/', router);
// }

// module.exports = web;
