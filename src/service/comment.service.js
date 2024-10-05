'use strict'

const _Comment = require('../model/comment.model.js')
const _User = require('../model/user.model.js')

class CommentService {
  static async createComment({comment, stars, itemId, picture, userId, parentId}) {
    const comment = new _Comment({
      comment_content,
      comment_stars: stars,
      comment_itemId: itemId, 
      comment_picture: picture,
      comment_userId: userId,
      comment_parentId: parentId
    })
    let rightValue
    if(parentId) {
      const parentComment = await _Comment.findById(parentId)
      rightValue = parentComment.comment_right

      await _Comment.updateMany({
        comment_itemId: itemId,
        comment_right: { $gte: rightValue }
      }, {
        $inc: {
          comment_right: 2
        }
      })

      await comment.updateMany({
        comment_itemId: itemId,
        comment_left: { $gte: rightValue }
      }, {
        $inc: {
          comment_left: 2
        }
      })
    } else {
      const maxRight = await _Comment.findOne({
        comment_itemId: itemId
      }).sort({comment_right: -1}).limit(1)

      if(maxRight) {
        rightValue = maxRight.comment_right + 1
      } else {
        rightValue = 1
      }
    }

    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    return await comment.save()
  }

  static async updateComment({commentId, userId, comment, stars, picture}) {
    const comment = await _Comment.findOne({
      _id: commentId,
      comment_userId: userId
    })
    if(!comment) throw new NotFoundError('Not found comment')

    comment.comment_content = comment
    comment.comment_stars = stars
    comment.comment_picture = picture
    
    return await comment.save()
  }

  static async deleteComment({commentId, userId, itemId}) {
    const comment = await _Comment.findOne({
      _id: commentId,
      comment_userId: userId
    })
    if(!comment) throw new NotFoundError('Not found comment')

    const leftValue = comment.comment_left
    const rightValue = comment.comment_right

    await _Comment.deleteMany({
      comment_itemId: itemId,
      comment_left: { $gte: leftValue, $lte: rightValue }
    })

    await _Comment.updateMany({
      comment_itemId: itemId,
      comment_right: { $gte: rightValue }
    }, {
      $inc: {
        comment_right: - (rightValue - leftValue + 1)
      }
    })

    await _Comment.updateMany({
      comment_itemId: itemId,
      comment_left: { $gte: leftValue }
    }, {
      $inc: {
        comment_left: - (rightValue - leftValue + 1)
      }
    })
    
    return true
  }

  static async getComment({itemId, page, limit}) {
    const comments = await _Comment.find({
      comment_itemId: itemId
    }).sort({comment_left: 1}).skip((page - 1) * limit).limit(limit)

    return comments
  }
}   

module.exports = CommentService

exports.getReviewWithItem = async(itemId, rateStar, page, limit) => {
  try{
    let start = 1;
    let end = 100;
      
    if(rateStar == '5') {
      start = 80;
      end = 100;
    }
    if(rateStar == '4') {
      start = 60;
      end = 80;
    }
    if(rateStar == '3') {
      start = 40;
      end = 60;
    }
    if(rateStar == '2') {
      start = 20;
      end = 40;
    }
    if(rateStar == '1') {
      start = 0;
      end = 20;
    }

    let reviews = await Review.find({
      itemId: itemId,
      stars: { $gte: start, $lte: end },
    })
      .populate("reviewer", "-password, -cart")
      .sort({ createdAt: -1 });

    if (page !== "undefined" || limit !== "undefined") {
      const data = pageSection(page, limit, reviews);
      return {
        status: 201,
        message: "ok",
        data: {
          data: data.result,
          totalPage: data.totalPage,
          totalOrder: reviews.length,
          currPage: page,
          nextPage: +page * +limit < reviews.length,
          prevPage: +page > 1,
        },
      };
    }
    return {
      status: 201,
      message: 'ok',
      data: reviews
    }
  }catch(err) {
    console.log(err);
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}
