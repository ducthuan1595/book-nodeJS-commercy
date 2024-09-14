"use strict";

const express = require("express")

const {
    createItem, 
    getItems, 
    getItemsDraftForShop, 
    getItemsPublishedForShop,
    getItem,
    updateItem,
    publishedItemForShop,
    unpublishedItemForShop,
    searchProduct,
    getItemWithFlashSale,
    removeProductById
} = require("../../controller/item.controller")
const { protect } = require("../../middleware/auth.middleware")
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.get("", asyncHandler(getItems))
router.get("/flashsale/all", asyncHandler(getItemWithFlashSale))
router.get("/search/:keySearch", asyncHandler(searchProduct))
router.get("/:id", asyncHandler(getItem))

router.use(protect)

router.post('', asyncHandler(createItem))
router.patch('/:id', asyncHandler(updateItem))
router.get("/draft/all", asyncHandler(getItemsDraftForShop))
router.get("/published/all", asyncHandler(getItemsPublishedForShop))
router.put('/published/:id', asyncHandler(publishedItemForShop))
router.put('/unpublished/:id', asyncHandler(unpublishedItemForShop))
router.delete('/:id/:type', asyncHandler(removeProductById))

module.exports = router;
