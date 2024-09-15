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
  getAllVoucher = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await getAllVoucher()
    }).send(res)
  }

  createVoucher = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await createVoucher({user: req.user, payload: req.body})
    }).send(res)
  }

  updateVoucher = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await updateVoucher({user: req.user, payload: req.body, voucherId: req.params.id})
    }).send(res)
  }

  publishedVoucher = async (req, res) => {
    new SuccessResponse({
      metadata: await publishedVoucher({user: req.user, voucherId: req.params.id})
    }).send(res)
  }

  unpublishedVoucher = async (req, res) => {
    new SuccessResponse({
      metadata: await unpublishedVoucher({user: req.user, voucherId: req.params.id})
    }).send(res)
  }

  deleteVoucher = async (req, res) => {
    new SuccessResponse({
      metadata: await deleteVoucher({user: req.user, voucherId: req.params.id})
    }).send(res)
  }
}

module.exports = new VoucherController()