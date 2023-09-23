const voucherService = require("../service/voucher");

exports.createVoucher = async (req, res) => {
  const { expiration, quantity, discount, code } = req.body;
  console.log(req.files);
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

exports.deleteVoucher = async (req, res) => {
  const { voucherId } = req.body;
  if (!voucherId) {
    res.status(404).json({ message: "Not voucher" });
  } else {
    const data = await voucherService.deleteVoucher(voucherId, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

exports.getVoucher = async (req, res) => {
  const page = req.query?.page !== "null" ? req.query.page : 1;
  const limit = req.query?.limit !== "null" ? req.query.limit : 8;
  const data = await voucherService.getVoucher(page, limit, req);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};
