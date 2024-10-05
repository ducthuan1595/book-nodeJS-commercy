"use strict";

const express = require("express");

const { createComment, getComment, updateComment, deleteComment } = require("../../controller/comment.controller");
const { protect } = require("../../middleware/auth.middleware");
const { asyncHandler } = require('../../support/asyncHandle')

const router = express.Router();

router.get("", asyncHandler(getComment));

router.use(protect);

router.post("", asyncHandler(createComment));
router.put("/:commentId", asyncHandler(updateComment));
router.delete("/:commentId", asyncHandler(deleteComment));

module.exports = router;
