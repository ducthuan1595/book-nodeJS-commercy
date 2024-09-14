"use strict";

const express = require("express");

const {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
} = require("../../controller/category.controller")
const { protect } = require("../../middleware/auth.middleware")
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.get("", asyncHandler(getAllCategory))

router.use(protect)

router.post("", asyncHandler(createCategory))
router.put("/:id", asyncHandler(updateCategory))
router.delete("/:id", asyncHandler(deleteCategory))

module.exports = router;
