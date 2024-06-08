const stripe = require('stripe');
require('dotenv').config();

const stripeConfig = () => {
  return stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-01-01',
  });
}

module.exports = stripeConfig;