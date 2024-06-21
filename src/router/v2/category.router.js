const express = require('express');

const categoryController = require('../../controller/category.controller');
const { protect } = require('../../middleware/auth.middleware')

const router = express.Router();

router.get("/get-all-category", categoryController.getAllCategory);
router.post(
  "/create-category",
  protect,
  categoryController.createCategory
);
router.post(
  "/update-category",
  protect,
  categoryController.updateCategory
);
router.post(
  "/delete-category",
  protect,
  categoryController.deleteCategory
);

module.exports = router;