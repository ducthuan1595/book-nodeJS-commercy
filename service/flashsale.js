const Flashsale = require("../model/flashsale");
const Item = require("../model/item");
const User = require("../model/user");
const scheduleSale = require("../suports/cron");
const pageSection = require("../suports/pageSection");

exports.createFlashsale = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const flashSale = new Flashsale({
          name: value.name,
          start_date: value.start,
          end_date: value.end,
          discount_percent: value.discountPercent,
          items: value.items,
        });
        const newFlashSale = await flashSale.save();
        if (
          newFlashSale &&
          newFlashSale.start_date > new Date() &&
          newFlashSale.end_date > newFlashSale.start_date
        ) {
          const items = await Item.find();
          const handleItem = async (arr, id) => {
            const item = arr.find((item) => {
              return item._id.toString() === id.toString();
            });
            item.pricePay = (
              item.priceInput -
              (item.priceInput * +value.discountPercent) / 100
            ).toFixed(2);
            item.flashSaleId = newFlashSale._id;
            await item.save();
          };
          value.items.map((item) => {
            return handleItem(items, item.itemId);
          });
        }
        const arrItemId = value.items.map((item) => item.itemId);
        scheduleSale(
          newFlashSale.start_date,
          newFlashSale.end_date,
          newFlashSale.discount_percent,
          arrItemId
        );
        resolve({
          status: 200,
          message: "ok",
          data: newFlashSale,
        });
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getFlashSale = (page, limit, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const flashSales = await Flashsale.find().populate("items.itemId");

        const flashSaleActive = flashSales.filter(
          (f) => f.end_date > Date.now()
        );

        const data = pageSection(page, limit, flashSales);
        if (flashSales) {
          resolve({
            status: 200,
            message: "ok",
            data: {
              currPage: +page,
              nextPage: +page * +limit < flashSales.length,
              prevPage: 0 < +page - 1,
              flashSales: data.result,
              totalPage: data.totalPage,
              totalFlashSale: flashSales.length,
              flashSaleActive,
            },
          });
        }
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
