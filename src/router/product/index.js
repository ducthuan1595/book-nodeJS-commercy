"use strict";

const express = require("express");

const itemController = require("../../controller/item.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/get-item", itemController.getAllItem);
router.get("/get-item-flashsale", itemController.getAllItemFlashSale);
router.get("/get-item-follow-price", itemController.getItemFollowPrice);

router.use(protect);

router.post("", itemController.createItem);
router.patch("", itemController.updateItem);
router.delete("", itemController.deleteItem);

module.exports = router;
