'use strict'

const { addCartByUser, deleteCartByUser } = require('../service/cart.service')
const { SuccessResponse } = require('../core/success.response')

class CartController {
  addCartByUser = async (req, res) => {
    const data = await addCartByUser({user: req.user, payload: req.body})
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  deleteCartByUser = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await deleteCartByUser({user: req.user, productId: req.params.id})
    }).send(res)
  }
}

module.exports = new CartController()
