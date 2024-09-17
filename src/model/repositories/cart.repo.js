const { CART_STATE } = require("../../types");
const _Cart = require("../cart.model");

const updateCartQuantity = async ({ payload, userId }) => {
  const { item, quantity } = payload;
  const query = {
      cart_userId: userId,
      "cart_products.item": item,
      cart_state: CART_STATE.active,
    },
    updates = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    },
    options = {
      new: true,
      upsert: true,
    };
  return await _Cart.findOneAndUpdate(query, updates, options);
};

const addProductToCart = async ({ payload, model }) => {
  const updateOne = {
    $addToSet: {
      "cart_products": payload,
    },
  };
  return await model.updateOne(updateOne);
}

module.exports = {
  updateCartQuantity,
  addProductToCart,
}
