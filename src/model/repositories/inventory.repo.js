'use strict'

const _Inventory = require('../../model/inventory.model')

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

module.exports = {
    insertInventory
}