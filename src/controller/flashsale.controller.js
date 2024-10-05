'use strict'

const {
  createFlashSaleByAdmin,
  updateFlashSale,
  addProductToFlashSale,
  getAllFlashSale
} = require("../service/flashsale.service")
const { SuccessResponse, CREATED } = require('../core/success.response')

class FlashSaleController {
  /**
   * 
   * @param {body: {flashsale_name, flashsale_description, flashsale_start_time, flashsale_end_time, flashsale_status, flashsale_type, flashsale_discount, flashsale_shop}} req 
   * @param {message: 'Create flash sale success', metadata: await createFlashSaleByAdmin({user: req.user, payload: req.body})} res 
   */
  createFlashSaleByAdmin = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await createFlashSaleByAdmin({user: req.user, payload: req.body})
    }).send(res)
  }

  /**
   * 
   * @param {body: {flashsale_name, flashsale_description, flashsale_start_time, flashsale_end_time, flashsale_status, flashsale_type, flashsale_discount, flashsale_shop}} req 
   * @param {message: 'Update flash sale success', metadata: await updateFlashSale({user: req.user, payload: req.body, flashsaleId: req.params.id})} res 
   */
  updateFlashSale = async (req, res) => {
    new CREATED({
      metadata: await updateFlashSale({user: req.user, payload: req.body, flashsaleId: req.params.id}) 
    }).send(res)
  }

  /**
   * 
   * @param {body: {flashsale_name, flashsale_description, flashsale_start_time, flashsale_end_time, flashsale_status, flashsale_type, flashsale_discount, flashsale_shop}} req 
   * @param {message: 'Add product to flash sale success', metadata: await addProductToFlashSale({user: req.user, payload: req.body, flashsaleId: req.params.id})} res 
   */
  addProductToFlashSale = async (req, res) => {
    new CREATED({
      metadata: await addProductToFlashSale({user: req.user, payload: req.body, flashsaleId: req.params.id}) 
    }).send(res)
  }

  /**
   * 
   * @param {query: {page, limit}} req 
   * @param {message: 'Get all flash sale success', metadata: await getAllFlashSale()} res 
   */
  getAllFlashSale = async(req, res) => {
    new SuccessResponse({
      metadata: await getAllFlashSale()
    }).send(res)
  }
}

module.exports = new FlashSaleController()

