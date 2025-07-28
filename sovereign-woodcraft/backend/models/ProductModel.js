// /models/productModel.js
import mongoose from 'mongoose';

// Create a new schema specifically for reviews
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // User's name
    rating: { type: Number, required: true }, // 1-5 stars
    comment: { type: String, required: true },
    user: {
      // Link to the user who wrote the review
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Assumes you have a 'User' model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const productSchema = mongoose.Schema(
  {
    // ... your existing fields like name, brand, description, etc.
    name: { type: String, required: true },
    brand: { type: String, required: true },
    // ... other fields

    // --- ADD/UPDATE THESE FIELDS ---
    reviews: [reviewSchema], // An array of review documents
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    // --- END OF ADDITIONS ---
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;