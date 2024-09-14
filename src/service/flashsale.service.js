'use strict'

const _Flashsale = require("../model/flashsale.model");
const scheduleSale = require("../support/cron")
const { AuthorizedFailError, BadRequestError } = require('../core/error.response');
const { uploadImage } = require("./upload.service");
const { removeUndefinedObject } = require("../util");

class FlashSaleService {
  static async createFlashSaleByAdmin({user, payload}) {
    if(!user.permit.permit_admin) {
      throw new AuthorizedFailError('Invalid permission')
    }
    if(payload.flashsale_start_date >= payload.flashsale_end_date) {
      throw new BadRequestError('Invalid date time')
    }
    const img = await uploadImage({url: payload.flashsale_banner, name: payload.flashsale_name, folder: 'flashsale'})
    payload.flashsale_banner = img
    return await _Flashsale.create({...payload})
  }

  static async updateFlashSale({user, payload, flashsaleId}) {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    return await _Flashsale.findByIdAndUpdate(flashsaleId, {...payload}, { new: true })
  }

  static async addProductToFlashSale({user, payload, flashsaleId}) {
    if(!user.permit.permit_admin && !user.permit.permit_moderator) {
      throw new AuthorizedFailError('Invalid permission')
    }
    return await _Flashsale.findByIdAndUpdate(flashsaleId, {
      flashsale_products: removeUndefinedObject(payload.items)
    }, { new: true })
  }

  static async getAllFlashSale () {
    return await _Flashsale.find().populate('flashsale_products.itemId').lean()
  }
}

module.exports = FlashSaleService

exports.createFlashsale = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await _User.findById(req.user._id);
      if (user && user.role === "F3") {
        const flashSale = new Flashsale({
          name: value.name,
          start_date: new Date(value.start).getTime(),
          end_date: new Date(value.end).getTime(),
          discount_percent: value.discountPercent,
          items: value.items,
        });
        const newFlashSale = await flashSale.save();

        const arrItemId = value.items.map((item) => item.itemId);
        scheduleSale(
          newFlashSale.start_date,
          newFlashSale.end_date,
          newFlashSale.discount_percent,
          newFlashSale._id,
          value,
          arrItemId
        );
        resolve({
          status: 200,
          message: "ok",
          data: newFlashSale,
        });
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getFlashSale = (page, limit, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await _User.findById(req.user._id);
      if (user) {
        const flashSales = await _Flashsale.find()
          .populate("items.itemId")
          .sort({ createdAt: -1 });

        const flashSaleActive = flashSales.filter(
          (f) => f.end_date > Date.now()
        );

        const data = pageSection(page, limit, flashSaleActive);
        if (flashSales) {
          resolve({
            status: 200,
            message: "ok",
            data: {
              currPage: +page,
              nextPage: +page * +limit < flashSaleActive.length,
              prevPage: 0 < +page - 1,
              flashSales: data.result,
              totalPage: data.totalPage,
              totalFlashSale: flashSaleActive.length,
              flashSaleActive,
            },
          });
        }
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
