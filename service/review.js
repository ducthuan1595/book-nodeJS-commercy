const Review = require('../model/review');

exports.createReview = async (comment, stars, itemId, req) => {
  try{
    const review = new Review({
      comment,
      stars,
      itemId,
      reviewer: req.user._id
    });
    const newReview = await review.save();
    if(newReview) {
      return {
        status: 200,
        message: 'ok',
        data: newReview
      }
    }
  }catch(err) {
    console.log(err);
  }
}