const { Schema, model } = require('mongoose')
const { CART_STATE } = require('../types')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

const cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: [CART_STATE.active, CART_STATE.completed, CART_STATE.failed, CART_STATE.pending],
        default: CART_STATE.active
    },
    cart_products: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: 'Item'
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    cart_count_product: {
        type: Number,
        default: 0
    },
    cart_userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, cartSchema)
