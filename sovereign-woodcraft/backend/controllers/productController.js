import asyncHandler from 'express-async-handler';
import Product from '../models/ProductModel.js';

// @desc    Get all products
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get single product
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get featured (top 4)
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).limit(4);
  res.json(products);
});
