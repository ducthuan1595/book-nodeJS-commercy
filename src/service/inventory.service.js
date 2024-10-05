'use strict'

const _Inventory = require('../model/inventory.model')

class InventoryService {
  static async addStockToInventory({productId, shopId, quantity, location = 'unknown'}) {
      const query = {inventory_productId: productId, inventory_shopId: shopId},
      update = {
          $inc: {inventory_stock: quantity},
          $set: {inventory_location: location}
      }

      const inventory = await _Inventory.findOneAndUpdate(query, update, {
          new: true,
          upsert: true
      })

      return inventory
  }

  static async cancelReserveStock({productId, cartId, quantity}) {
    const query = {inventory_productId: productId, inventory_reservations: {$elemMatch: {cartId, quantity: {$gte: quantity}}}},
    update = {
      $inc: {inventory_stock: quantity},
      $pull: {inventory_reservations: {cartId, quantity}}
    }
    return await _Inventory.findOneAndUpdate(query, update, {new: true})
  }
}

module.exports = InventoryService
