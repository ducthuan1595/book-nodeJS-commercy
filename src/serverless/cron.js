const flashsaleService = require("../service/flashsale");

module.exports = cronJobs = async (req, res) => {
  const { name, startDate, endDate, discountPercent, arrItem } = req.body;
  if (!name || !startDate || !endDate || !discountPercent || !arrItem.length) {
    return res.status(400).json({ message: "Input invalid!" });
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
