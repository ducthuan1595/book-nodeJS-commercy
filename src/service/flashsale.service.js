'use strict'

const _Flashsale = require("../model/flashsale.model");
const scheduleSale = require("../support/cron")
const { AuthorizedFailError, BadRequestError } = require('../core/error.response');
const { uploadImage } = require("./upload.service");
const { removeUndefinedObject } = require("../util")
const { FLASHSALE_STATUS } = require('../types')

class FlashSaleService {
  static async createFlashSaleByAdmin({user, payload}) {
    if(!user.permit.permit_admin) {
      throw new AuthorizedFailError('Invalid permission')
    }
    if(payload.flashsale_start_date >= payload.flashsale_end_date) {
      throw new BadRequestError('Invalid date time')
    }
    const img = await uploadImage({url: payload.flashsale_banner, folder: 'flashsale'})
    payload.flashsale_banner = img
    return await _Flashsale.create({...payload})
  }

  static async updateFlashSale({user, payload, flashsaleId}) {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    return await _Flashsale.findByIdAndUpdate(flashsaleId, {...payload}, { new: true })
  }

  static async addProductToFlashSale({user, payload, flashsaleId}) {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    return await _Flashsale.findByIdAndUpdate(flashsaleId, {
      flashsale_products: removeUndefinedObject(payload.items)
    }, { new: true })
  }

  static async getAllFlashSale () {
    return await _Flashsale.find().populate('flashsale_products.itemId').lean()
  }

  static async changeStatus({user, flashSaleId, status}) {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    return await _Flashsale.findByIdAndUpdate(flashSaleId, { flashsale_status: FLASHSALE_STATUS[status] }, { new: true })
  }
}

module.exports = FlashSaleService

