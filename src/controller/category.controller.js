'use strict'

const {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory
} = require("../service/category.service")
const { OK } = require('../core/success.response')

class CategoryController {
  /**
   * 
   * @param {body: {category_name, category_description, category_type, category_shop}} req 
   * @param {message: 'Create category success', metadata: await createCategory({user: req.user, payload: req.body})} res 
   */
  createCategory = async (req, res) => {
    const data = await createCategory({user: req.user, payload: req.body})
    new OK({
      message: 'ok',
      metadata: data
    }).send(res)
  }

  /**
   * 
   * @param {query: {page, limit}} req 
   * @param {message: 'Get all category success', metadata: await getAllCategory()} res 
   */
  getAllCategory = async (req, res) => {
    new OK({
      metadata: await getAllCategory()
    }).send(res)
  }

  /**
   * 
   * @param {body: {category_name, category_description, category_type, category_shop}} req 
   * @param {message: 'Update category success', metadata: await updateCategory({user: req.user, payload: req.body, categoryId: req.params.id})} res 
   */
  updateCategory = async (req, res) => {
    new OK({
      metadata: await updateCategory({user: req.user, payload: req.body, categoryId: req.params.id})
    }).send(res)
  }

  /**
   * 
   * @param {body: {categoryId}} req 
   * @param {message: 'Delete category success', metadata: await deleteCategory({user: req.user, categoryId: req.params.id})} res 
   */
  deleteCategory = async (req, res) => {
    new OK({
      metadata: await deleteCategory({user: req.user, categoryId: req.params.id})
    }).send(res)
  }
}

module.exports = new CategoryController()
