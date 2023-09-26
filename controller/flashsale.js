const flashsaleService = require("../service/flashsale");

exports.createFlashsale = async (req, res) => {
  const { name, startDate, endDate, discountPercent, arrItem } = req.body;
  if (!name || !startDate || !endDate || !discountPercent || !arrItem.length) {
    return res.status(404).json({ message: "Input invalid!" });
  }
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const data = await flashsaleService.createFlashsale(
    {
      name,
      start,
      end,
      discountPercent,
      items: arrItem,
    },
    req
  );
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.getFlashSale = async (req, res) => {
  const page = req.query?.page === "null" ? 1 : req.query?.page;
  const limit = req.query?.limit === "null" ? 8 : req.query?.limit;

  const data = await flashsaleService.getFlashSale(page, limit, req);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};
