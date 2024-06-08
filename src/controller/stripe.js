require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

exports.getPublishKey = async (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

exports.createPayment = async(req, res) => {
  try{
    const {pay} = req.body;
    const payment = await stripe.paymentIntents.create({
      currency: "vnd",
      amount: +pay,
      automatic_payment_methods: { enabled: true },
    });
    res.status(200).json({message: 'ok', data: {
      clientSecret: payment.client_secret
    }})
  }catch(err) {
    res.status(400).json({message: err.message})
  }
}
