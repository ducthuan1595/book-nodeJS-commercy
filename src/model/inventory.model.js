'use strict'

const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'inventories'

const inventorySchema = new Schema({
    inventory_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    inventory_location: {
        type: String,
        default: 'unknown'
    },
    inventory_stock: {
        type: Number,
        required: true
    },
    inventory_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    inventory_reservations: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, inventorySchema)