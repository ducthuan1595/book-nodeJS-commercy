const { createOrder } = require("../service/order.service");
const { SuccessResponse } = require('../core/success.response')


class OrderController {

  /**
   * @body {string} cartId,
   * @body {array} shop_order_ids: [
   *    {
   *       shopId,
   *       shop_discount: [],
   *       item_products: [
   *          {
   *            price, quantity, productId
   *          }
   *       ]
   *    },
   *    {
   *      shopId,
   *      shop_discount: [
   *        {
   *          shopId, discountId, codeId
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
      metadata: await createOrder({
        ...req.body,
        user: req.user
      })
    })
  }

}

module.exports = new OrderController()
