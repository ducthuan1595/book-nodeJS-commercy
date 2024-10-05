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
    }).send(res)
  }

  /**
   * 
   * @param {body: {status}} req 
   * @param {message: 'Change order status success', metadata: await changeOrderStatus({orderId: req.params.orderId, status: req.body.status})} res 
   */
  changeOrderStatus = async (req, res) => {
    new SuccessResponse({
      message: 'Change order status success',
      metadata: await changeOrderStatus({orderId: req.params.orderId, status: req.body.status})
    }).send(res)
  }

  /**
   * 
   * @param {body: {shop_order_ids}} req 
   * @param {message: 'Cancel order success', metadata: await cancelOrder({orderId: req.params.orderId, shop_order_ids: req.body.shop_order_ids})} res 
   */
  cancelOrder = async (req, res) => {
    new SuccessResponse({
      message: 'Cancel order success',
      metadata: await cancelOrder({orderId: req.params.orderId, shop_order_ids: req.body.shop_order_ids})
    }).send(res)
  }

  /**
   * 
   * @param {query: {page, limit, productId}} req 
   * @param {message: 'Get order success', metadata: await getOrderByProduct({productId: req.params.productId, ...req.query})} res 
   */
  getOrderByProduct = async (req, res) => {
    new SuccessResponse({
      message: 'Get order success',
      metadata: await getOrderByProduct({productId: req.params.productId, ...req.query})
    }).send(res)
  } 

  /**
   * 
   * @param {query: {page, limit}} req 
   * @param {message: 'Get order success', metadata: await getOrderByUser({userId: req.user.userId, ...req.query})} res 
   */
  getOrderByUser = async (req, res) => {
    new SuccessResponse({
      message: 'Get order success',
      metadata: await getOrderByUser({userId: req.user.userId, ...req.query})
    }).send(res)
  }

  /**
   * 
   * @param {query: {page, limit, shopId}} req 
   * @param {message: 'Get order success', metadata: await getOrderByShop({...req.query, shopId: req.params.shopId})} res 
   */
  getOrderByShop = async (req, res) => {
    new SuccessResponse({
      message: 'Get order success',
      metadata: await getOrderByShop({...req.query, shopId: req.params.shopId})
    }).send(res)
  }

  /**
   * 
   * @param {query: {page, limit}} req 
   * @param {message: 'Get order success', metadata: await getOrderByAdmin({userId: req.user.userId, ...req.query})} res 
   */
  getOrderByAdmin = async (req, res) => {
    new SuccessResponse({
      message: 'Get order success',
      metadata: await getOrderByAdmin({userId: req.user.userId, ...req.query})
    }).send(res)
  } 

}

module.exports = new OrderController()
