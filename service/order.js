const Order = require("../model/order");
const User = require("../model/user");

exports.createOrder = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const arrCart = user.cart.items;
        const handleArr = (arr, id) => {
          return arr.find((v) => v.toString() === id.toString());
        };
        const newArrOrder = arrCart.filter((v) =>
          handleArr(value.arrCartId, v._id)
        );
        const updateCart = arrCart.filter(
          (v) => !handleArr(value.arrCartId, v._id)
        );

        user.cart.items = updateCart;
        await user.save();
        const newQuantity = newArrOrder.reduce((a, b) => {
          return a + b.quantity;
        }, 0);
        const order = new Order({
          userId: user._id,
          amount: value.amount,
          quantity: newQuantity,
          items: newArrOrder,
        });
        const updateOrder = await order.save();
        resolve({
          status: 200,
          message: "ok",
          data: updateOrder,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
