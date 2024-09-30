"use strict";

const express = require("express")

const { protect } = require("../../middleware/auth.middleware");
const { asyncHandler } = require("../../support/asyncHandle");
const { uploadImage } = require('../../controller/upload.controller')

const router = express.Router();

router.use(protect);

router.post("", asyncHandler(uploadImage))


module.exports = router;
