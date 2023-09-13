const Flashsale = require("../model/flashsale");
const Item = require("../model/item");
const User = require("../model/user");

exports.createFlashsale = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const flashSale = new Flashsale({
          name: value.name,
          description: value.description,
          start_date: value.startDate,
          end_date: value.endDate,
          discount_percent: value.discountPercent,
          items: value.items,
        });
        const newFlashSale = await flashSale.save();
        if (newFlashSale) {
          const items = await Item.find();
          const handleItem = async (arr, id) => {
            const item = arr.find((item) => {
              return item._id.toString() === id.toString();
            });
            item.pricePay =
              item.pricePay - (item.pricePay * +value.discountPercent) / 100;
            item.flashSaleId = newFlashSale._id;
            await item.save();
          };
          value.items.map((item) => {
            return handleItem(items, item.itemId);
          });
          console.log(Date.now());
          console.log(Date.now() + 1000000);
        }
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

exports.getFlashSale = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const flashSales = await Flashsale.find();
        if (flashSales) {
          resolve({
            status: 200,
            message: "ok",
            data: flashSales,
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
