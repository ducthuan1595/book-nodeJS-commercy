'use strict'

const { Types } = require('mongoose')
const { _Product, _Electronic, _Book, _Clothing } = require('../../model/item.model')
const { getSelectData, unGetSelectData } = require('../../util')

const findAllProduct = async({limit, sort, filter, select, page}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await _Product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

const findAllProductWithQuery = async({query, limit, skip}) => {  
    return await _Product.find(query)
        .populate('product_shop', '-user_password')
        .sort({updatedAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findProduct = async({product_id, unselect}) => {
    return await _Product.findById(product_id).select(unGetSelectData(unselect))
}

const publishProductByShop = async({product_id, product_shop}) => {
    const foundShop = await _Product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unpublishProductByShop = async({product_shop, product_id}) => {
    const foundShop = await _Product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const searchProductByUser = async(keySearch) => {
    const regexSearch = new RegExp(keySearch, 'i')
    let result = await _Product.find({
        isPublished: true,
        $text: { $search: regexSearch }
    }, {
        score: { $meta: 'textScore' }
    })
    .sort({score: { $meta: 'textScore' }})
    .lean()

    //result = await _Product.find({ entityData: { $elemMatch: { key: regexSearch, value: /^Ky/i, }, }, })

    return result
}

const updateProductById = async({product_id, payload, model, isNew = true}) => {
    return await model.findByIdAndUpdate(product_id, payload, { new: isNew })
}

module.exports = {
    findAllProduct,
    findProduct,
    publishProductByShop,
    unpublishProductByShop,
    searchProductByUser,
    updateProductById,
    findAllProductWithQuery,
}