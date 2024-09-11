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
  getProductWithFlashSale
} = require("../service/item.service")
const { createItemValidate } = require('../support/validation/item.validation')
const { NotFoundError } = require('../core/error.response')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
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

  getItem = async (req, res) => {
    const data = await getProduct(req.params.id)
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  getItems = async (req, res) => {
    const data = await getAllProduct(req.query)
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  getItemWithFlashSale = async (req, res) => {
    const data = await getProductWithFlashSale(req.query)
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  getItemsDraftForShop = async (req, res) => {
    const data = await findAllDraftsForShop({product_shop: req.user.userId, ...req.query})
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  getItemsPublishedForShop = async (req, res) => {
    const data = await findAllPublishedForShop({product_shop: req.user.userId, ...req.query})
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }

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

  searchProduct = async (req, res) => {
    const data = await searchProduct(req.params.keySearch)
    new SuccessResponse({
      message: 'ok',
      metadata: data
    }).send(res)
  }
   
}

module.exports = new ProductController()
