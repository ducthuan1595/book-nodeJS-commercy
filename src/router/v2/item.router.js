const express = require('express');

const itemController = require('../../controller/item.controller');
const { protect } = require('../../middleware/auth.middleware')

const router = express.Router();

router.post(
    "/create-item",
    protect,
    itemController.createItem
);
router.post(
"/update-item",
protect,
itemController.updateItem
);
router.post(
"/delete-item",
protect,
itemController.deleteItem
);
router.get("/get-item", itemController.getAllItem);
router.get("/get-item-flashsale", itemController.getAllItemFlashSale);
router.get("/get-item-follow-price", itemController.getItemFollowPrice);

module.exports = router;