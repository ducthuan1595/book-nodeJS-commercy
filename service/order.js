const Item = require("../model/item");
const Order = require("../model/order");
const User = require("../model/user");
const Voucher = require("../model/voucher");

exports.createOrder = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        // add items for order
        const arrCart = user.cart.items;
        if (arrCart.length) {
          const handleArr = (arr, id) => {
            return arr.find((v) => v.toString() === id.toString());
          };
          const newArrOrder = arrCart.filter((v) =>
            handleArr(value.arrCartId, v._id)
          );
          const updateItem = arrCart.filter(
            (v) => !handleArr(value.arrCartId, v._id)
          );
          user.cart.items = updateItem;
          await user.save();

          // update quantity for order
          const newQuantity = newArrOrder.reduce((a, b) => {
            return a + b.quantity;
          }, 0);

          // Update mount
          let amount = 0;

          // Update count
          const arrId = newArrOrder.map((item) => item.itemId.toString());
          const items = await Item.find().where("_id", arrId);
          const updateCount = async (arr, id, quantity) => {
            const item = arr.find((v) => v._id.toString() === id.toString());
            amount += item.pricePay;
            const newQuantity = item.count - quantity;
            item.count = newQuantity;
            await item.save();
          };
          newArrOrder.forEach((item) => {
            updateCount(items, item.itemId, +item.quantity);
          });

          // Apply voucher
          if (value.voucherCode) {
            const voucher = await Voucher.findOne({ code: value.voucherCode });
            if (
              new Date().getTime() < voucher.expirationDate &&
              voucher.quantity > 0 &&
              voucher.isActive === true
            ) {
              amount = amount - (amount * +voucher.discount) / 100;
              voucher.quantity = voucher.quantity - 1;
              await voucher.save();
            } else {
              voucher.isActive = false;
              await voucher.save();
            }
          }

          const order = new Order({
            userId: user._id,
            amount: amount,
            quantity: newQuantity,
            items: newArrOrder,
          });
          const updateOrder = await order.save();
          resolve({
            status: 200,
            message: "ok",
            data: updateOrder,
          });
        } else {
          resolve({
            status: 404,
            message: "Not found item in the cart",
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};
