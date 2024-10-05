const { getVoucherAmount } = require('./discount.repo.js')
const { getFlashsaleAmount } = require('./discount.repo.js')
const { checkProductByService } = require('./item.repo.js')

orderReview = async ({cartId, shop_order_ids, userId}) => {
  // check cartId exist
  const foundCart =  await _Cart.findById(cartId)
  if(!foundCart) throw new BadRequestError('Not found cart')
  
  const checkOrder = {
    totalPrice: 0,
    feeShip: 0,
    totalDiscount: 0,
    totalCheckout: 0
  }, shop_order_ids_new  = []

  for(let i = 0; i < shop_order_ids; i++) {
    const  {shopId, shop_vouchers = [], item_products = [], flashsaleId} = shop_order_ids[i]
    // check product available
    const checkProductService = await checkProductByService(item_products)
    if(!checkProductService[0]) throw new BadRequestError('order wrong')

    const checkoutPrice = checkProductService.reduce((acc, product) => {
      return acc + (product.quantity * product.price)
    }, 0)

    // total price order
    checkOrder.totalPrice += checkoutPrice
    const itemCheckout = {
      shopId,
      shop_vouchers,
      flashsaleId,
      priceRaw: checkoutPrice,
      priceApplyDiscount: checkoutPrice,
      item_products: checkProductService
    }

    //// handle with voucher
    if(shop_vouchers.length > 0) {
      const checkVoucher = {
        totalOrder: 0,
        discount: 0,
        totalPrice: 0
      }
      for(let voucher of shop_vouchers) {
        const {voucherId, codeId} = voucher
        const { totalOrder, discount, totalPrice } = await getVoucherAmount({voucherId, codeId, products: checkProductService, userId})
        
        checkVoucher.totalOrder += totalOrder
        checkVoucher.discount += discount
        checkVoucher.totalPrice += totalPrice
      }

      // get total voucher
      checkOrder.totalDiscount += checkVoucher.discount
      if(checkVoucher.discount > 0) {
        itemCheckout.priceApplyDiscount = checkoutPrice - checkVoucher.discount
      }
    }

    //// handle with flashsale
    if(flashsaleId) {
      for(let product of checkProductService) {
        const { discountAmount } = getFlashsaleAmount(flashsaleId, product)
        itemCheckout.priceApplyDiscount -= discountAmount
        checkOrder.totalDiscount += discountAmount
      }
    }

    checkOrder.totalCheckout += itemCheckout.priceApplyDiscount
    shop_order_ids_new.push(itemCheckout)
  }
  return {
    shop_order_ids_new,
    checkout_order: checkOrder
  }
}

module.exports = {
  orderReview
}
