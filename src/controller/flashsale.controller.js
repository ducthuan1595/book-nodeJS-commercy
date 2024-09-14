'use strict'

const {
  createFlashSaleByAdmin,
  updateFlashSale,
  addProductToFlashSale,
  getAllFlashSale
} = require("../service/flashsale.service")
const { SuccessResponse, CREATED } = require('../core/success.response')

class FlashSaleController {
  createFlashSaleByAdmin = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await createFlashSaleByAdmin({user: req.user, payload: req.body})
    }).send(res)
  }

  updateFlashSale = async (req, res) => {
    new CREATED({
      metadata: await updateFlashSale({user: req.user, payload: req.body, flashsaleId: req.params.id}) 
    }).send(res)
  }

  addProductToFlashSale = async (req, res) => {
    new CREATED({
      metadata: await addProductToFlashSale({user: req.user, payload: req.body, flashsaleId: req.params.id}) 
    }).send(res)
  }

  getAllFlashSale = async(req, res) => {
    new SuccessResponse({
      metadata: await getAllFlashSale()
    }).send(res)
  }
}

module.exports = new FlashSaleController()

