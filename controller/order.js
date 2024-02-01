const orderService = require("../service/order");

exports.createOrder = async (req, res) => {
  const { arrCartId, methodPay } = req.body;
  const voucherCode = req.body?.voucherCode;
  if (!arrCartId) {
    res.status(404).json({ message: "Input invalid" });
  } else {
    const data = await orderService.createOrder(
      { arrCartId, voucherCode, methodPay },
      req
    );
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

exports.getOrder = async (req, res) => {
  const page = req.query?.page === "null" ? 1 : req.query.page;
  const limit = req.query?.limit === "null" ? 10 : req.query.limit;
  const type = req.query?.type === "null" ? null : req.query.type;
  const column = req.query?.column === "null" ? null : req.query.column;
  const data = await orderService.getOrder(page, limit, type, column, req);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.getRevenue = async(req, res) => {
  try{
    const type = req.query.type;
    const year = req.query.year;
    const data = await orderService.getRevenue(type, year);
    res.status(data.status).json({message: data.message, data: data.data})
  }catch(err) {
    res.status(500).json({message: 'Error from server'})
  }
}
