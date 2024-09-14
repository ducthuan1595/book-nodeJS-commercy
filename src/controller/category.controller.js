'use strict'

const {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory
} = require("../service/category.service")
const { OK } = require('../core/success.response')

class CategoryController {
  createCategory = async (req, res) => {
    const data = await createCategory({user: req.user, payload: req.body})
    new OK({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  getAllCategory = async (req, res) => {
    new OK({
      metadata: await getAllCategory()
    }).send(res)
  }

  updateCategory = async (req, res) => {
    new OK({
      metadata: await updateCategory({user: req.user, payload: req.body, categoryId: req.params.id})
    }).send(res)
  }

  deleteCategory = async (req, res) => {
    new OK({
      metadata: await deleteCategory({user: req.user, categoryId: req.params.id})
    }).send(res)
  }
}

module.exports = new CategoryController()
