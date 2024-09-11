const mongoose = require("mongoose");
const slugify = require('slugify')

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: Array,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_slogan: {
      type: String,
      required: false,
    },
    product_slug: {
      type: Number,
    },
    product_price: {
      origin: {
        type: Number,
        required: true,
      },
      sale: {
        type: Number,
        default: null
      }
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5'],
      set: (val) =>  Math.round(val * 10) / 10
    },
    product_flashSaleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flashsale",
      default: null,
    },
    product_variation: {
      type: Array,
      default: []
    },
    product_type: {
      type: String,
      required: true,
      enum: [
        'book',
        'clothing',
        'electronic'
      ]
    },
    product_reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false
    },
  },
  { timestamps: true }
)

productSchema.index({product_name: 'text', product_description: 'text'})
productSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name, {lower: true})
  next()
})


const clothingSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  size: String,
  material: String,
  origin_from: String
}, {
  collection: 'clothes',
  timestamps: true
})

const electronicsSchema = new mongoose.Schema({
  manufacture: {
    type: String,
    required: true
  },
  model: String,
  color: String,
  origin_from: String
}, {
  collection: 'electronics',
  timestamps: true
})

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  sheets: Number,
  publishing_house: String,
  language: String,
}, {
  collection: 'books',
  timestamps: true
})


module.exports = {
  _Product: mongoose.model("Item", productSchema),
  _Clothing: mongoose.model("Clothes", clothingSchema),
  _Electronic: mongoose.model('Electronic', electronicsSchema),
  _Book: mongoose.model('Book', bookSchema)
}
