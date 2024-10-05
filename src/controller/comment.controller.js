'use strict'

const {createComment, getComment, updateComment, deleteComment} = require('../service/comment')
const {SuccessResponse} = require('../core/success.response')

class CommentController {

  /**
   * 
   * @param {body: {comment, stars, itemId, picture, parentId}} req 
   * @param {message: 'Create comment success', metadata: await createComment(req.body)} res 
   * @param {*} next 
   */
  static async createComment(req, res, next) {
    new SuccessResponse({
      message: 'Create comment success',
      metadata: await createComment({ userId: req.user.userId, ...req.body })
    }).send(res)
  }

  /**
   * 
   * @param {query: {itemId, page, limit}} req 
   * @param {message: 'Get comment success', metadata: await getComment(req.query)} res 
   * @param {*} next 
   */
  static async getComment(req, res, next) {
    new SuccessResponse({
      message: 'Get comment success',
      metadata: await getComment(req.query)
    }).send(res)
  }

  /**
   * 
   * @param {body: {commentId, stars, picture}} req 
   * @param {message: 'Update comment success', metadata: await updateComment(req.body)} res 
   * @param {*} next 
   */
  static async updateComment(req, res, next) {
    new SuccessResponse({
      message: 'Update comment success',
      metadata: await updateComment({ userId: req.user.userId, ...req.body })
    }).send(res)
  }

  /**
   * 
   * @param {body: {commentId, itemId}} req 
   * @param {message: 'Delete comment success', metadata: await deleteComment(req.body)} res 
   * @param {*} next 
   */
  static async deleteComment(req, res, next) {
    new SuccessResponse({
      message: 'Delete comment success',
      metadata: await deleteComment({ userId: req.user.userId, ...req.body })
    }).send(res)
  }
}

module.exports = new CommentController()
