import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  description: String,
  price: { type: mongoose.Types.Decimal128, required: true },
  images: [String],
  options: {
    colors: [String],
    sizes: [String],
  },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
