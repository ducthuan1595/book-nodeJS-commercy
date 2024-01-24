const reviewService = require('../service/review');

exports.createReview = async (req, res) => {
  const {comment, stars, itemId} = req.body;
  if(!comment || !stars || !itemId) {
    return res.status(404).json({message: 'Not found!'})
  }
  const data = await reviewService.createReview(comment, stars, itemId, req);
  if(data) {
    return res.status(data.status).json({message: data.message, data: data.data})
  }
};

exports.getReview = async (req, res) => {
  try{
    const {itemId} = req.query;
    const data = await reviewService.getReview(itemId, req);
    if(data) {
      return res.status(data.status).json({message: data.message, data: data.data})
    }
  }catch(err) {
    return res.status(500).json({message: 'Error Server'})
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { comment, stars, reviewId } = req.body;
    if (!comment || !stars || !reviewId) {
      return res.status(404).json({ message: "Not found!" });
    }
    const data = await reviewService.createReview(comment, stars, reviewId);
    if(data) {
      return res.status(data.status).json({message: data.message, data: data.data})
    }
  }catch(err) {
    return res.status(500).json({message: 'Error Server'})
  }
}