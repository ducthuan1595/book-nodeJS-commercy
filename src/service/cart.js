const _Item = require("../model/item.model.js");
const _User = require("../model/user.model.js");

exports.addCart = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await _User.findById(req.user._id)
        .populate("cart.itemId")
        .select("-password");
      if (user) {
        let updateUser;
        if (user) {
          if (user.cart.length < 1) {
            const addCart = [
              {
                itemId: value.itemId,
                quantity: value.quantity,
              },
            ];

            user.cart = addCart;
            updateUser = await user.save();
            // updateUser = await User.findOneAndUpdate(
            //   { _id: user._id },
            //   { cart: addCart }
            // ).populate("cart.itemId");
          } else {
            const existItemIndex = user.cart.findIndex((item) => {
              return item.itemId._id.toString() === value.itemId.toString();
            });
            const updateItem = [...user.cart];
            if (existItemIndex !== -1) {
              const newQuantity =
                +user.cart[existItemIndex].quantity + +value.quantity;
              updateItem[existItemIndex].quantity = Number(newQuantity);
            } else {
              updateItem.push({
                itemId: value.itemId,
                quantity: value.quantity,
              });
            }

            user.cart = updateItem;
            updateUser = await user.save();
            // updateUser = await User.findOneAndUpdate(
            //   { _id: user._id },
            //   { cart: updateItem }
            // ).populate("cart.itemId");
          }
          const updateUserCart = await _User.findById(req.user._id).populate(
            "cart.itemId"
          );
          resolve({
            status: 200,
            message: "ok",
            data: updateUserCart,
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

exports.deleteCart = (cartId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await _User.findById(req.user._id).populate("cart.itemId");
      if (user && user.cart) {
        const updateCart = user.cart.filter(
          (item) => item._id.toString() !== cartId.toString()
        );
        user.cart = updateCart;
        const updateUser = await user.save();

        resolve({
          status: 200,
          message: "ok",
          data: updateUser,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
