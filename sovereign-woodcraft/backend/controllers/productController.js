import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/ProductModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    // Assuming your ProductModel has an 'isFeatured' boolean field
    const products = await Product.find({ isFeatured: true }).limit(4);
    res.json(products);
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, imageUrls, countInStock, isFeatured } = req.body;

  const product = new Product({
    name,
    price,
    user: req.user._id, // From 'protect' middleware
    imageUrls,
    category,
    countInStock,
    description,
    isFeatured,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, imageUrls, countInStock, isFeatured } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price ?? product.price;
    product.description = description || product.description;
    product.imageUrls = imageUrls || product.imageUrls;
    product.category = category || product.category;
    product.countInStock = countInStock ?? product.countInStock;
    product.isFeatured = isFeatured ?? product.isFeatured;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get all products for the management page
// @route   GET /api/products/manage
// @access  Private/Admin
export const getProductsForManagement = asyncHandler(async (req, res) => {
  // In the future, you could add logic here to calculate total orders for each product
  const products = await Product.find({});
  res.status(200).json(products);
});
