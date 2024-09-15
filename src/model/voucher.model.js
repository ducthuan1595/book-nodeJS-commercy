const mongoose = require("mongoose")

const DOCUMENT_NAME = 'Voucher'
const COLLECTION_NAME = 'vouchers'

const schema = new mongoose.Schema(
  {
    voucher_code: {
      type: String,
      required: true,
      unique: true,
    },
    voucher_expiration: {
      type: Number,
      required: true,
    },
    voucher_description: {
      type: String,
      required: true,
    },
    voucher_discount: {
      type: Number,
      required: true,
    },
    voucher_quantity: {
      type: Number,
      required: true,
    },
    voucher_thumb: {
      type: Object
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, schema);
