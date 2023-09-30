const voucherService = require("../service/voucher");

exports.createVoucher = async (req, res) => {
  const { expiration, quantity, discount, code } = req.body;
  const pic = req.files.pic;
  if (!expiration || !quantity || !discount || !pic || !code)
    return res.status(404).json({ message: "Input invalid" });
  const data = await voucherService.createVoucher(
    expiration,
    quantity,
    discount,
    pic,
    code,
    req
  );
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.getVoucher = async (req, res) => {
  const page = req.query?.page !== "null" ? req.query.page : null;
  const limit = req.query?.limit !== "null" ? req.query.limit : null;
  const data = await voucherService.getVoucher(page, limit);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};
