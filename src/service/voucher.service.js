'use strict'

const voucher_codes = require("voucher-code-generator")
const _Voucher = require("../model/voucher.model")
const { AuthorizedFailError, NotFoundError, BadRequestError } = require('../core/error.response')
const { uploadImage, removeImage } = require("./upload.service");

class VoucherService {
  static async createVoucher({user, payload}) {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    if(new Date().getTime() > payload.voucher_expiration) {
      throw new BadRequestError('Expires time invalid')
    }
    const code = voucher_codes.generate({
      length: 8,
      count: 1,
      prefix: "_"
    })
    const img = await uploadImage({url: payload.voucher_thumb, folder: 'voucher'})
    payload.voucher_thumb = img
    payload.voucher_code = code[0]
    return await _Voucher.create({...payload})
  }

  static async updateVoucher({user, payload, voucherId}) {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    const voucher = await _Voucher.findById(voucherId)
    if(!voucher) throw new NotFoundError('Not found voucher')

    let img = {}
    if(payload.voucher_thumb) {
      await removeImage({public_id: voucher.voucher_thumb.public_id})
      img = await uploadImage({ url: payload.voucher_thumb, folder: 'voucher' })
    }

    Object.assign(voucher, payload)
    return await voucher.save()
  }

  static async getAllVoucher() {
    return await _Voucher.find()
  }

  static async publishedVoucher({user, voucherId}) {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    return await _Voucher.findByIdAndUpdate(voucherId, { isPublished: true }, { new: true })
  }

  static async unpublishedVoucher({user, voucherId}) {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    return await _Voucher.findByIdAndUpdate(voucherId, { isPublished: false }, { new: true })
  }

  static async deleteVoucher({user, voucherId}) {
    if(!user.permit.permit_admin) {
      throw new AuthorizedFailError('Invalid permission')
    }
    return await _Voucher.findByIdAndDelete(voucherId) ? 1 : 0
  }
}

module.exports = VoucherService
