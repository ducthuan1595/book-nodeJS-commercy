const orderService = require("../service/order");

exports.createOrder = async (req, res) => {
  const { amount, arrCartId } = req.body;
  if (!amount && !arrCartId) {
    res.status(404).json({ message: "Input invalid" });
  } else {
    const data = await orderService.createOrder({ amount, arrCartId }, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};
