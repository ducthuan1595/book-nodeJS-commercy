'use strict'

const { 
  createProduct, 
  updateProduct, 
  getAllProduct, 
  findAllDraftsForShop,
  findAllPublishedForShop,
  getProduct,
  publishProductByShop,
  unpublishProductByShop,
  searchProduct,
  getProductWithFlashSale,
  removeProduct
} = require("../service/item.service")
const { createItemValidate } = require('../support/validation/item.validation')
const { NotFoundError } = require('../core/error.response')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
  /**
   * 
   * @param {body: {product_name, product_price, product_description, product_type, product_shop, product_attributes}} req 
   * @param {message: 'Create product success', metadata: await createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.user.userId
    })} res 
   */
  createItem = async (req, res) => {
    // const {error} = createItemValidate(req.body)
    // if (error) {
    //     throw new NotFoundError(error.details[0].message)
    // }
    const data = await createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.user.userId
    });
    new SuccessResponse({
        message: 'ok',
        metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {body: {product_name, product_price, product_description, product_type, product_shop, product_attributes}} req 
   * @param {message: 'Update product success', metadata: await updateProduct(req.body.product_type, req.params.id, {
      ...req.body,
      product_shop: req.user.userId
    })} res 
   */
  updateItem = async (req, res) => {
    const data = await updateProduct(req.body.product_type, req.params.id, {
      ...req.body,
      product_shop: req.user.userId
    })
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {message: 'Get product success', metadata: await getProduct(req.params.id)} res 
   */
  getItem = async (req, res) => {
    const data = await getProduct(req.params.id)
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {query: {page, limit}} req 
   * @param {message: 'Get products success', metadata: await getAllProduct(req.query)} res 
   */
  getItems = async (req, res) => {
    const data = await getAllProduct(req.query)
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {query: {page, limit}} req 
   * @param {message: 'Get products with flash sale success', metadata: await getProductWithFlashSale(req.query)} res 
   */
  getItemWithFlashSale = async (req, res) => {
    const data = await getProductWithFlashSale(req.query)
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {query: {page, limit}} req 
   * @param {message: 'Get products draft for shop success', metadata: await findAllDraftsForShop({product_shop: req.user.userId, ...req.query})} res 
   */
  getItemsDraftForShop = async (req, res) => {
    const data = await findAllDraftsForShop({product_shop: req.user.userId, ...req.query})
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {query: {page, limit}} req 
   * @param {message: 'Get products published for shop success', metadata: await findAllPublishedForShop({product_shop: req.user.userId, ...req.query})} res 
   */
  getItemsPublishedForShop = async (req, res) => {
    const data = await findAllPublishedForShop({product_shop: req.user.userId, ...req.query})
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {message: 'Published product success', metadata: await publishProductByShop({
      product_id: req.params.id,
      product_shop: req.user.userId 
    })} res 
   */
  publishedItemForShop = async (req, res) => {
    const data = await publishProductByShop({
      product_id: req.params.id,
      product_shop: req.user.userId 
    })
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }
  
  /**
   * 
   * @param {message: 'Unpublished product success', metadata: await unpublishProductByShop({
      product_id: req.params.id,
      product_shop: req.user.userId 
    })
   */
  unpublishedItemForShop = async (req, res) => {
    const data = await unpublishProductByShop({
      product_id: req.params.id,
      product_shop: req.user.userId 
    })
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {query: {keySearch}} req 
   * @param {message: 'Search product success', metadata: await searchProduct(req.params.keySearch)} res 
   */
  searchProduct = async (req, res) => {
    const data = await searchProduct(req.params.keySearch)
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {message: 'Remove product success', metadata: await removeProduct({
      product_id: req.params.id,
      product_shop: req.user.userId,
      product_type: req.params.type
    })} res 
   */
  removeProductById = async (req, res) => {
    const data = await removeProduct({
      product_id: req.params.id,
      product_shop: req.user.userId,
      product_type: req.params.type
    })
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }
   
}

module.exports = new ProductController()
