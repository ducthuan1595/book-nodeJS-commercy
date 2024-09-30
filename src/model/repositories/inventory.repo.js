'use strict'

const _Inventory = require('../../model/inventory.model')
const { convertObjectIdMongoDb } = require('../../util')

const insertInventory = async({
    productId,
    shopId,
    stock,
    location = 'unknown'
}) => {
    return await _Inventory.create({
        inventory_productId: productId,
        inventory_stock: stock,
        inventory_location: location,
        inventory_shopId: shopId
    })
}

const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        inventory_productId: convertObjectIdMongoDb(productId),
        inventory_stock: { $gte: quantity }
    }
    const updates = {
        $inc: {
            inventory_stock: -quantity
        },
        $push: {
            inventory_reservations: {
                quantity,
                cartId,
                createdAt: new Date()
            }
        }
    }
    const options  = { upsert: true, new: true }

    return await _Inventory.updateOne(query, updates, options)
}

module.exports = {
    insertInventory,
    reservationInventory
}