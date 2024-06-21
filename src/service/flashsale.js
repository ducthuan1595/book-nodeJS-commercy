const _Flashsale = require("../model/flashsale");
const _Item = require("../model/item.model.js");
const _User = require("../model/user.model.js");
const scheduleSale = require("../support/cron");
const pageSection = require("../support/pageSection");

exports.createFlashsale = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await _User.findById(req.user._id);
      if (user && user.role === "F3") {
        const flashSale = new Flashsale({
          name: value.name,
          start_date: new Date(value.start).getTime(),
          end_date: new Date(value.end).getTime(),
          discount_percent: value.discountPercent,
          items: value.items,
        });
        const newFlashSale = await flashSale.save();

        const arrItemId = value.items.map((item) => item.itemId);
        scheduleSale(
          newFlashSale.start_date,
          newFlashSale.end_date,
          newFlashSale.discount_percent,
          newFlashSale._id,
          value,
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
      const user = await _User.findById(req.user._id);
      if (user) {
        const flashSales = await _Flashsale.find()
          .populate("items.itemId")
          .sort({ createdAt: -1 });

        const flashSaleActive = flashSales.filter(
          (f) => f.end_date > Date.now()
        );

        const data = pageSection(page, limit, flashSaleActive);
        if (flashSales) {
          resolve({
            status: 200,
            message: "ok",
            data: {
              currPage: +page,
              nextPage: +page * +limit < flashSaleActive.length,
              prevPage: 0 < +page - 1,
              flashSales: data.result,
              totalPage: data.totalPage,
              totalFlashSale: flashSaleActive.length,
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
