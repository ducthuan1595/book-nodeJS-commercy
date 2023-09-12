const Item = require("../model/item");
const User = require("../model/user");

exports.addCart = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        // const cart = await user?.populate("cart.items");
        if (user) {
          const existItemIndex = user.cart.items.findIndex(
            (item) => item.itemId.toString() === value.itemId.toString()
          );
          const updateItem = [...user.cart.items];
          if (existItemIndex != -1) {
            const newQuantity =
              +user.cart.items[existItemIndex].quantity + +value.quantity;
            updateItem[existItemIndex].quantity = Number(newQuantity);
          } else {
            updateItem.push({
              itemId: value.itemId,
              quantity: value.quantity,
            });
          }
          const updateCart = {
            items: updateItem,
          };
          await User.findOneAndUpdate({ _id: user._id }, { cart: updateCart });
          resolve({
            status: 200,
            message: "ok",
          });
        } else {
          resolve({
            status: 404,
            message: "Not found user",
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.deleteCart = (itemId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const updateCart = user.cart.items.filter(
          (item) => item.itemId.toString() !== itemId.toString()
        );
        user.cart.items = updateCart;
        await user.save();
        resolve({
          status: 200,
          message: "ok",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getCart = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const cart = user.cart.items;
        resolve({
          status: 200,
          message: "ok",
          data: cart,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
