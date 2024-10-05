const mongoose = require("mongoose");
const { ORDER_STATUS } = require("../common/constant.js");

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

const orderSchema = new mongoose.Schema(
  {
    order_userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // street, city, state, country
    order_shipping: {
      type: Object,
      default: {}
    },
    /* total price, total discount, voucher code, method payment, shopId */
    order_checkout: {
      type: Object,
      default: {}
    },
    order_tracking: {
      type: String,
      required: true,
    },
    order_status: {
      type: String,
      enum: [ORDER_STATUS.pending, ORDER_STATUS.confirm, ORDER_STATUS.cancelled, ORDER_STATUS.delivered],
      default: ORDER_STATUS.pending
    },
    order_products: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ]
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
