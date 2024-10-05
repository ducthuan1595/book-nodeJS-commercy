'use strict'

const { addCartByUser, deleteCartByUser } = require('../service/cart.service')
const { SuccessResponse } = require('../core/success.response')

class CartController {
  /**
   * 
   * @param {body: {product_id, quantity, old_quantity}} req 
   * @param {message: 'Add to cart success', metadata: await addCartByUser({user: req.user, payload: req.body})} res 
   */ 
  addCartByUser = async (req, res) => {
    const data = await addCartByUser({user: req.user, payload: req.body})
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {body: {product_id}} req 
   * @param {message: 'Delete cart success', metadata: await deleteCartByUser({user: req.user, productId: req.params.id})} res 
   */
  deleteCartByUser = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await deleteCartByUser({user: req.user, productId: req.params.id})
    }).send(res)
  }
}

module.exports = new CartController()
