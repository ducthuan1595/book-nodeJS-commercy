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
};

exports.getReview = async (itemId, req) => {
  try{
    let reviews = await Review.find({
      reviewer: req.user._id});
    
    if (itemId !== "undefined") {
      reviews = reviews.filter(
        (item) => item.itemId.toString() === itemId.toString()
      );
    }

    return {
      status: 201,
      message: 'ok',
      data: reviews
    }

  }catch(err) {
    console.error(err);
  }
}

exports.createReview = async (comment, stars, reviewId) => {
  try {
    const review = await Review.findById(reviewId);
    if(review) {
      review.comment = comment;
      review.stars = stars;
    }
    const newReview = await review.save();
    if (newReview) {
      return {
        status: 200,
        message: "ok",
        data: newReview,
      };
    }
  } catch (err) {
    console.log(err);
  }
};