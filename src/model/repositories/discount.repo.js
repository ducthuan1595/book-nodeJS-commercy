'use strict'

const { NotFoundError } = require('../../core/error.response')
const { VOUCHER_STATE, VOUCHER_APPLY_TO } = require('../../types')
const { convertObjectIdMongoDb } = require('../../util')
const _Voucher = require('../voucher.model')

const getVoucherAmount = async({voucherId, codeId, products, userId}) => {
  const foundVoucher =  await _Voucher.findOne({
    voucher_code: codeId,
    _id: convertObjectIdMongoDb(voucherId)
  })

  const { 
    isPublished,
    voucher_quantity,
    voucher_start_date,
    voucher_end_date,
    voucher_users_used,
    voucher_type,
    voucher_discount,
    voucher_apply_to,
    voucher_products
  } = foundVoucher

  if(!foundVoucher) throw new NotFoundError('Invalid voucher')

  if(!isPublished) throw new NotFoundError('Not published')

  if(voucher_quantity < 1) throw new NotFoundError('Voucher was got out')

  if(voucher_start_date > new Date().getTime() || voucher_end_date < new Date().getTime()) {
    throw new NotFoundError('Voucher has expired')
  }

  let totalOrder = 0
  if(voucher_min_order_value > 0) {
    totalOrder = products.reduce((acc, product) => {
      return acc + (product.quantity * product.price)
    }, 0)
    if(totalOrder < voucher_min_order_value) {
      throw new NotFoundError('Order required a minimum value ' + voucher_min_order_value)
    }
  }

  if(voucher_max_uses_per_user < 0) {
    throw new NotFoundError('Maximum voucher for user')
  }
  const numUserExist = voucher_users_used.filter(user => user.toString() === userId.toString())
  if(numUserExist > voucher_max_uses_per_user) throw new NotFoundError('User used more than allowed amount voucher')

  // check product  has exist in voucher products
  if(voucher_apply_to === VOUCHER_APPLY_TO.specific) {
    const seen = new Set(voucher_products.id)
    for(let value of products) {
      if(!seen.has(value.productId)) {
        throw new NotFoundError('product is not exist in voucher products')
      }
    }
  }

  const amount = voucher_type === VOUCHER_STATE.fixed_amount ? voucher_discount : (totalOrder * (voucher_discount / 100)).toFixed(0)

  // update voucher db
  const newQuantity = products.reduce((acc, product) => acc + product.quantity , 0)
  foundVoucher.voucher_quantity -= newQuantity
  foundVoucher.voucher_used_count += newQuantity
  foundVoucher.voucher_users_used.push(userId)
  await foundVoucher.save()

  return {
    totalOrder,
    discount: +amount,
    totalPrice: totalOrder - +amount
  }
}

const getFlashsaleAmount = async (flashsaleId, product) => {
  const foundFlashsale = await _FlashSale.findById(flashsaleId)
  if(!foundFlashsale) throw  new NotFoundError('Not found flash sale')

  const { 
    flashsale_start_date, 
    flashsale_end_date,
    flashsale_status,
    flashsale_products,
    flashsale_discount_percent,
    flashsale_quantity
  } = foundFlashsale

  if(flashsale_start_date > Date.now() || flashsale_end_date < Date.now()) {
    throw new BadRequestError('Flash sale is expired')
  }

  switch(flashsale_status.FLASHSALE_STATUS) {
    case 'pending':
      throw new BadRequestError('Flashsale statue is pending')
    case 'inactive':
      throw new BadRequestError('Flashsale status is inactive')
  }
  
  const flashsaleItem = flashsale_products.ids.find(item => item.toString() === product.productId.toString())

  if(flashsaleItem && flashsale_quantity > 0 && flashsale_quantity >= product.quantity) {
    const discountAmount = (flashsale_discount_percent / 100).toFixed(2)

    //update quantity flashsale for item
    foundFlashsale.flashsale_quantity -= product.quantity
    await foundFlashsale.save()

    return {
      discountAmount
    }
  }
}

module.exports = {
  getVoucherAmount,
  getFlashsaleAmount
}
