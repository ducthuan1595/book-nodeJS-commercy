const voucherService = require("../service/voucher");

exports.createVoucher = async (req, res) => {
  const { expiration, quantity, discount } = req.body;
  if (!expiration || !quantity || !discount)
    return res.status(404).json({ message: "Input invalid" });
  const data = await voucherService.createVoucher(
    expiration,
    quantity,
    discount,
    req
  );
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.getVoucher = async (req, res) => {
  const data = await voucherService.getVoucher(req);
  if (data) {
    res.status(data.status).json({ message: data.data, data: data?.data });
  }
};
