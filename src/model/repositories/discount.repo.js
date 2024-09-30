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

  return {
    totalOrder,
    discount: +amount,
    totalPrice: totalOrder - +amount
  }
}

module.exports = {
  getVoucherAmount
}
