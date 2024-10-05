const mongoose = require("mongoose")
const { VOUCHER_STATE, VOUCHER_APPLY_TO } = require('../common/constant.js')

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
      enum: [VOUCHER_STATE.fixed_amount, VOUCHER_STATE.percent_amount],
      default: VOUCHER_STATE.fixed_amount
    },
    voucher_start_date: {
      type: Number,
      required: true
    },
    voucher_end_date: {
      type: Number,
      required: true
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
    voucher_max_uses_per_user: {
      type: Number,
      default: 0
    },
    voucher_users_used: {
      type: Array,
      default: []
    },
    voucher_products: {
      type: Array,
      ids: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item'
        }
      ],
      validate: {
        validator: function(value) {
          if(this.voucher_apply_to === VOUCHER_APPLY_TO.all) {
            return value.ids.length === 0
          }
          return true
        },
        message: props => `voucher_apply_type is not valid with voucher_apply_type`
      }
    },
    voucher_min_order_value: {
      type: Number,
      required: true
    },
    voucher_apply_to: {
      type: String,
      default: VOUCHER_APPLY_TO.all,
      enum: [VOUCHER_APPLY_TO.all, VOUCHER_APPLY_TO.specific]
    },
    // voucher_apply_type: {
    //   type: Array,
    //   enum: [
    //     VOUCHER_APPLY_TYPE.t_all, 
    //     VOUCHER_APPLY_TYPE.t_001, 
    //     VOUCHER_APPLY_TYPE.t_002, 
    //     VOUCHER_APPLY_TYPE.t_003
    //   ],
    //   default: [],
    //   validate: {
    //     validator: function(value) {
    //       if(this.voucher_apply_to === VOUCHER_APPLY_TO.specific) {
    //         return value !== VOUCHER_APPLY_TYPE.t_all
    //       }
    //       return true
    //     },
    //     message: props => `voucher_apply_type is not valid with voucher_apply_type: ${props.value}`
    //   }
    // }
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, schema);
