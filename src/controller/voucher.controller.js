'use strict'

const {
  getAllVoucher,
  createVoucher,
  updateVoucher,
  publishedVoucher,
  unpublishedVoucher,
  deleteVoucher
} = require("../service/voucher.service")
const { SuccessResponse } = require('../core/success.response')

class VoucherController {
  /**
   * 
   * @param {message: 'Get voucher success', metadata: await getAllVoucher()} res 
   */
  getAllVoucher = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await getAllVoucher()
    }).send(res)
  }

  /**
   * 
   * @param {body: {voucher_name, voucher_code, voucher_type, discount_value, quantity, start_time, end_time, user_id}} req 
   * @param {message: 'Create voucher success', metadata: await createVoucher({user: req.user, payload: req.body})} res 
   */
  createVoucher = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await createVoucher({user: req.user, payload: req.body})
    }).send(res)
  }

  /**
   * 
   * @param {body: {voucher_name, voucher_code, voucher_type, discount_value, quantity, start_time, end_time, user_id}} req 
   * @param {message: 'Update voucher success', metadata: await updateVoucher({user: req.user, payload: req.body, voucherId: req.params.id})} res 
   */
  updateVoucher = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await updateVoucher({user: req.user, payload: req.body, voucherId: req.params.id})
    }).send(res)
  }

  /**
   * 
   * @param {message: 'Published voucher success', metadata: await publishedVoucher({user: req.user, voucherId: req.params.id})} res 
   */
  publishedVoucher = async (req, res) => {
    new SuccessResponse({
      metadata: await publishedVoucher({user: req.user, voucherId: req.params.id})
    }).send(res)
  }

  /**
   * 
   * @param {message: 'Unpublished voucher success', metadata: await unpublishedVoucher({user: req.user, voucherId: req.params.id})} res 
   */
  unpublishedVoucher = async (req, res) => {
    new SuccessResponse({
      metadata: await unpublishedVoucher({user: req.user, voucherId: req.params.id})
    }).send(res)
  }

  /**
   * 
   * @param {message: 'Delete voucher success', metadata: await deleteVoucher({user: req.user, voucherId: req.params.id})} res 
   */
  deleteVoucher = async (req, res) => {
    new SuccessResponse({
      metadata: await deleteVoucher({user: req.user, voucherId: req.params.id})
    }).send(res)
  }
}

module.exports = new VoucherController()