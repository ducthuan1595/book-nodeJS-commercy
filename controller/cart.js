const cartService = require("../service/cart");

exports.addCart = async (req, res) => {
  const { quantity, itemId } = req.body;
  if (!quantity || !itemId) {
    res.status(403).json({ message: "Input invalid!" });
  } else {
    const data = await cartService.addCart({ quantity, itemId }, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

exports.deleteCart = async (req, res) => {
  const { cartId } = req.body;
  if (!cartId) {
    res.status(403).json({ message: "Input invalid!" });
  } else {
    const data = await cartService.deleteCart(cartId, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};
