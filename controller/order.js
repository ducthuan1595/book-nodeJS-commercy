const orderService = require("../service/order");

exports.createOrder = async (req, res) => {
  const { arrCartId } = req.body;
  const voucherCode = req.body?.voucherCode;
  if (!arrCartId) {
    res.status(404).json({ message: "Input invalid" });
  } else {
    const data = await orderService.createOrder(
      { arrCartId, voucherCode },
      req
    );
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};
