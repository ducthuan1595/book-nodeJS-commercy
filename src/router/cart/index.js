'use strict'

const express = require('express')

const { addCartByUser, deleteCartByUser } = require('../../controller/cart.controller')
const { protect } = require('../../middleware/auth.middleware')
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router()

router.use(protect)

router.put("", asyncHandler(addCartByUser))
router.delete("/:id", asyncHandler(deleteCartByUser))

module.exports = router