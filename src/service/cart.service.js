'use strict'

const { NotFoundError } = require('../core/error.response')
const _Cart = require('../model/cart.model')
const { findProduct } = require('../model/repositories/item.repo')
const { CART_STATE } = require('../types')
const { addProductToCart, updateCartQuantity } = require('../model/repositories/cart.repo')
const { convertObjectIdMongoDb } = require('../util')

class CartService {
  static async addCartByUser({user, payload}) {
    const foundProduct = await findProduct({product_id: payload.item})
    if(!foundProduct) throw new NotFoundError('Not found product')

    const query = {cart_userId: user.userId, cart_state: CART_STATE.active}
    // Check cart with user
    const foundCart = await _Cart.findOne(query)
    if(!foundCart) throw new NotFoundError('Not found Cart')
    
    // Update cart with user
    let items = foundCart.cart_products
    if(items.length < 1 || items.every(i => i.item.toString() !== payload.item.toString())) {
      return await addProductToCart({payload, model: foundCart})
    }
    return await updateCartQuantity({payload, userId: user.userId})
  }

  static async deleteCartByUser ({user, productId}) {
    const query = {cart_userId: convertObjectIdMongoDb(user.userId), cart_state: CART_STATE.active}
    const updateSet = {
      $pull: {
        'cart_products': {
          item: productId
        }
      }
    }

    return await _Cart.updateOne(query, updateSet) ? 1 : 0
  }
}

module.exports = CartService
