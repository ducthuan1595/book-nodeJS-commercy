'use strict'

const _Category = require("../model/category.model");
const { uploadImage, removeImage } = require('./upload.service.js')
const { AuthorizedFailError, NotFoundError } = require("../core/error.response.js");

class CategoryService {
  static createCategory = async ({user, payload}) => {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    const img = await uploadImage({url: payload.category_banner, folder: 'category'})
    payload.category_banner = img
    return await _Category.create(payload)
  }

  static getAllCategory = async () => {
    const filter = {category_isActive: true}
    return await _Category.find(filter).lean()
  }

  static updateCategory = async ({user, payload, categoryId}) => {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    const category = await _Category.findById(categoryId)
    if(!category) throw new NotFoundError('Not found category')

    if(payload.category_banner) {
      await removeImage({public_id: category.category_banner.public_id})
      const img = await uploadImage({url: payload.category_banner, folder: 'category'})
      payload.category_banner = img
    }
    return await new category({...payload}).save()
  }

  static deleteCategory = async ({user, categoryId}) => {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    const category = await _Category.findById(categoryId)
    if(!category) throw new NotFoundError('Not found category')

    await removeImage({public_id: category.category_banner.public_id})
    return await category.deleteOne() ? 1 : 0
  }
}

module.exports = CategoryService

