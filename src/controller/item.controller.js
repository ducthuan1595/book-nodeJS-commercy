'use strict'

const { createItem } = require("../service/item.service")
const { createItemValidate } = require('../support/validation/item.validation')
const { NotFoundError } = require('../core/error.response')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createItem = async (req, res) => {
        const {error} = createItemValidate(req.body)
        if (error) {
            throw new NotFoundError(error.details[0].message)
        }
        const data = await createItem({data: req.body, user: req.user});
        new SuccessResponse({
            message: data.message,
            metadata: data.data
        }).send(res)
    }
    
    updateItem = async (req, res) => {
      const {
        name,
        priceInput,
        slogan,
        description,
        barcode,
        count,
        categoryId,
        itemId,
        author,
        pages,
        language,
        pic,
        detailPic,
      } = req.body;
    
      if (
        !name ||
        !priceInput ||
        !description ||
        !barcode ||
        !count ||
        !categoryId ||
        !itemId ||
        !pages ||
        !author
      ) {
        res.status(404).json({ message: "Input invalid" });
      } else {
        const data = await itemService.updateItem(
          {
            name,
            priceInput,
            slogan,
            description,
            barcode,
            count,
            categoryId,
            pic,
            detailPic,
            itemId,
            pages,
            language,
            author,
          },
          req
        );
        if (data) {
          res.status(data.status).json({ message: data.message, data: data?.data });
        }
      }
    }
    
    deleteItem = async (req, res) => {
      const itemId = req.body.itemId;
      if (!itemId) {
        res.status(404).json({ message: "Input invalid" });
      }
      const data = await itemService.deleteItem(itemId, req);
      if (data) {
        res.status(data.status).json({ message: data.message, data: data.data });
      }
    }
    
    getAllItem = async (req, res) => {
      const key = req.query.key === "null" ? null : req.query?.key;
      const filter = req.query.filter === "null" ? null : req.query?.filter;
      const sort = req.query.sort === "null" ? null : req.query?.sort;
      const limit = req.query.limit === "null" ? null : req.query?.limit;
      const page = req.query.page === "null" ? null : req.query?.page;
      const itemId = req.query?.itemId === "null" ? null : req.query?.itemId;
      const type = req.query?.type === "null" ? null : req.query?.type;
      const column = req.query?.column === "null" ? null : req.query?.column;
      const isSale = req.query?.isSale === "true" ? true : false;
      const data = await itemService.getAllItem(
        key,
        filter,
        sort,
        limit,
        page,
        itemId,
        type,
        column,
        isSale
      );
      if (data) {
        res.status(data.status).json({ message: data.message, data: data?.data });
      }
    }
    
    getAllItemFlashSale = async (req, res) => {
      const data = await itemService.getAllItemFlashSale();
      if (data) {
        res.status(data.status).json({ message: "ok", data: data?.data });
      }
    }
    
    getItemFollowPrice = async (req, res) => {
      const { low, hight, name } = req.query;
      if (!low || !hight || !name) {
        res.status(404).json({ message: "Input invalid" });
      }
      const data = await itemService.getItemFollowPrice(low, hight, name);
      if (data) {
        res.status(data.status).json({ message: data.message, data: data?.data });
      }
    }
}

module.exports = new ProductController()
