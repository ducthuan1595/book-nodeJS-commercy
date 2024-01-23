const reviewService = require('../service/review');

exports.createReview = async (req, res) => {
  const {comment, stars, itemId} = req.body;
  console.log(req.body);
  if(!comment || !stars || !itemId) {
    return res.status(404).json({message: 'Not found!'})
  }
  const data = await reviewService.createReview(comment, stars, itemId, req);
  if(data) {
    return res.status(data.status).json({message: data.message, data: data.data})
  }
}