const { orderByUser } = require("../service/order.service");
const { SuccessResponse } = require('../core/success.response')


class OrderController {

  /**
   * @body {string} cartId,
   * @body {array} shop_order_ids: [
   *    {
   *       shopId,
   *       shop_voucher: [],
   *       flashsaleId: '',
   *       item_products: [
   *          {
   *            price, quantity, productId
   *          }
   *       ]
   *    },
   *    {
   *      shopId,
   *      shop_voucher: [
   *        {
   *           discountId, codeId
   *        }  
   *      ],
   *      item_products: [
   *        {
   *          price, quantity, productId
   *        }
   *      ]
   *    }
   * ]
   * 
   */

  createOrder = async (req, res) => {
    new SuccessResponse({
      message: 'Order success',
      metadata: await orderByUser({
        ...req.body,
        user: req.user
      })
    })
  }

}

module.exports = new OrderController()
