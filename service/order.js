const Item = require("../model/item");
const Order = require("../model/order");
const User = require("../model/user");
const Voucher = require("../model/voucher");
const FlashSale = require("../model/flashsale");
const pageSection = require("../suports/pageSection");
const sendMail = require("../config/nodemailer");
const Review = require("../model/review");

exports.createOrder = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id)
        .populate("cart.itemId")
        .select("-password");
      if (user && user.role !== "F1") {
        // add items for order
        const arrCart = user.cart;
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
          user.cart = updateItem;
          const updateUser = await user.save();

          // update quantity for order
          const newQuantity = newArrOrder.reduce((a, b) => {
            return a + b.quantity;
          }, 0);

          // Update mount
          let amount = 0;

          // Update count
          const arrId = newArrOrder.map((item) => item.itemId._id.toString());
          const items = await Item.find().where("_id", arrId);
          // let flashSale;
          const updateCount = async (arr, id, quantity) => {
            const item = arr.find((v) => v._id.toString() === id.toString());
            if (item.flashSaleId) {
              const flashSale = await FlashSale.findById(item.flashSaleId);
              // update flashsale
              if (flashSale) {
                const quantitySale = flashSale.items.find((v) => {
                  if (v.itemId.toString() === item._id.toString()) {
                    return v;
                  }
                });
                if (
                  flashSale &&
                  flashSale.end_date < Date.now() &&
                  flashSale.start_date > Date.now() &&
                  quantitySale.quantity < 1
                ) {
                  item.pricePay = item.priceInput;
                  item.flashSaleId = null;
                }
                amount += item.pricePay * +quantity;

                const updateFlashSaleItem = flashSale.items.find(
                  (v) => v.itemId.toString() === item._id.toString()
                );

                const newQuantityFlashSale = +quantitySale.quantity - +quantity;
                updateFlashSaleItem.quantity = newQuantityFlashSale;
                await flashSale.save();
              }
              // }
            } else {
              amount += item.pricePay * +quantity;
            }
            // update Item
            const newQuantity = item.count - quantity;
            item.count = newQuantity;
            await item.save();
          };
          for (let i = 0; i < newArrOrder.length; i++) {
            await updateCount(
              items,
              newArrOrder[i].itemId._id,
              +newArrOrder[i].quantity
            );
          }
          // Apply voucher
          let voucherId;
          if (value.voucherCode) {
            const voucher = await Voucher.findOne({ code: value.voucherCode });
            if (
              voucher &&
              Date.now() < voucher.expirationDate &&
              voucher.quantity > 0
            ) {
              amount = Math.floor(amount - (amount * +voucher.discount) / 100);
              voucher.quantity = voucher.quantity - 1;
              voucherId = voucher._id;
              await voucher.save();
            }
          }

          const order = new Order({
            userId: user._id,
            amount: amount,
            quantity: newQuantity,
            items: newArrOrder,
            voucherId: voucherId ?? null
          });
          if (order) {
            const updateOrder = await order.save();
            const arrItemId = updateOrder.items.map((i) => i.itemId);
            sendMail(
              user.email,
              user.username,
              null,
              arrItemId,
              null,
              updateOrder.createdAt,
              null,
              null,
              true,
              newQuantity,
              amount
            );
            resolve({
              status: 200,
              message: "ok",
              data: {
                updateOrder,
                updateUser,
              },
            });
          }
        } else {
          resolve({
            status: 404,
            message: "Not found item in the cart",
          });
        }
      } else {
        resolve({
          status: 403,
          message: "User invalid",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getOrder = (page, limit, type, column, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F2") {
        const orders = await Order.find({ userId: req.user._id })
          .populate("userId", '-password')
          .populate("items.itemId")
          .sort({ createdAt: -1 });

        if (orders.length) {
          const data = pageSection(page, limit, orders);

          resolve({
            status: 200,
            message: "ok",
            data: {
              orders: data.result,
              totalPage: data.totalPage,
              totalOrder: orders.length,
              currPage: page,
              nextPage: +page * +limit < orders.length,
              prevPage: +page > 1,
            },
          });
        }
      } else if (user && user.role === "F3") {
        const orders = await Order.find()
          .populate("userId", "-password")
          .populate("items.itemId")
          .sort([[column, type]]);
        if (orders.length) {
          const data = pageSection(page, limit, orders);

          resolve({
            status: 200,
            message: "ok",
            data: {
              orders: data.result,
              totalPage: data.totalPage,
              totalOrder: orders.length,
              currPage: page,
              nextPage: +page * +limit < orders.length,
              prevPage: +page > 1,
            },
          });
        }
      } else {
        resolve({
          status: 403,
          message: "Unauthorized!",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
