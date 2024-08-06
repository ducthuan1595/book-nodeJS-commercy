"use strict";

const express = require("express");

const categoryController = require("../../controller/category.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("", categoryController.getAllCategory);

router.use(protect);

router.post("", categoryController.createCategory);
router.put("", categoryController.updateCategory);
router.delete("", categoryController.deleteCategory);

module.exports = router;
