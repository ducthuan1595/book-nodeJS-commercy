const mongoose = require("mongoose")
const { FLASHSALE_STATUS } = require('../types')

const DOCUMENT_NAME = 'FlashSale'
const COLLECTION_NAME = 'flashsales'

const schema = new mongoose.Schema(
  {
    flashsale_name: {
      type: String,
      required: true,
    },
    flashsale_banner: {
      type: Object,
      required: true,
    },
    flashsale_start_date: {
      type: Number,
      required: true,
    },
    flashsale_end_date: {
      type: Number,
      required: true,
    },
    flashsale_discount_percent: {
      type: Number,
      required: true,
    },
    flashsale_status: {
      type: String,
      enum: [FLASHSALE_STATUS.active, FLASHSALE_STATUS.inactive, FLASHSALE_STATUS.pending],
      default: FLASHSALE_STATUS.pending
    },
    flashsale_quantity: {
      type: Number,
      default: 0
    },
    flashsale_products: {
      type: Array,
      ids: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
      ]
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, schema);
