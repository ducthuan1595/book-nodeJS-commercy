const flashsaleService = require("../service/flashsale");

exports.createFlashsale = async (req, res) => {
  const { name, description, startDate, endDate, discountPercent, items } =
    req.body;
  if (
    !name ||
    !description ||
    !startDate ||
    !endDate ||
    !discountPercent ||
    !items
  ) {
    return res.status(404).json({ message: "Input invalid!" });
  }
  const data = await flashsaleService.createFlashsale(
    {
      name,
      description,
      startDate,
      endDate,
      discountPercent,
      items,
    },
    req
  );
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.getFlashSale = async (req, res) => {
  const data = await flashsaleService.getFlashSale();
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};
