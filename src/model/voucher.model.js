const mongoose = require("mongoose")
const { VOUCHER_STATE, VOUCHER_APPLY_TO } = require('../types')

const DOCUMENT_NAME = 'Voucher'
const COLLECTION_NAME = 'vouchers'

const schema = new mongoose.Schema(
  {
    voucher_code: {
      type: String,
      required: true,
      unique: true,
    },
    voucher_name: {
      type: String,
      required: true,
    },
    voucher_type: {
      type: String,
      enum: [VOUCHER_STATE.fixed_amount, VOUCHER_STATE.free_ship],
      default: VOUCHER_STATE.free_ship
    },
    voucher_start_date: {
      type: Number,
      required: true
    },
    voucher_end_date: {
      type: Number,
      required: true
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
    },
    voucher_used_count: {
      type: Number,
      required: true,
      default: 0
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
    },
    voucher_products: {
      type: Array,
      default: [],
      ids: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item'
        }
      ]
    },
    voucher_min_order_value: {
      type: Number,
      required: true
    },
    voucher_apply_to: {
      type: String,
      required: true,
      enum: [VOUCHER_APPLY_TO.all, VOUCHER_APPLY_TO.specific]
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, schema);
