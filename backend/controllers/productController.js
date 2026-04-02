import asyncHandler from '../middleware/asyncHandler.js';
import { getProducts as readProducts, writeProducts } from '../utils/jsonData.js';

// Helper function to find product by ID
const findProductById = (products, id) => {
  return products.find(p => p._id === id);
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await readProducts();
  res.json(products);
});

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const products = await readProducts();
  const product = findProductById(products, req.params.id);
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
  const products = await readProducts();
  const featuredProducts = products.filter(p => p.isFeatured);
  res.json(featuredProducts);
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, imageUrls, countInStock, isFeatured, brand } = req.body;

  const products = await readProducts();
  
  // Generate new ID
  const maxId = products.reduce((max, p) => {
    const id = parseInt(p._id, 10);
    return id > max ? id : max;
  }, 0);

  const product = {
    _id: (maxId + 1).toString(),
    name,
    price,
    description,
    category,
    imageUrls: imageUrls || [],
    countInStock: countInStock || 0,
    isFeatured: isFeatured || false,
    brand: brand || 'Sovereign Woodcraft',
    rating: 0,
    numReviews: 0,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  products.push(product);
  await writeProducts(products);
  
  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, imageUrls, countInStock, isFeatured, brand, isActive } = req.body;
  const productId = req.params.id;
  
  const products = await readProducts();
  const productIndex = products.findIndex(p => p._id === productId);

  if (productIndex !== -1) {
    products[productIndex] = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      price: price ?? products[productIndex].price,
      description: description || products[productIndex].description,
      category: category || products[productIndex].category,
      imageUrls: imageUrls || products[productIndex].imageUrls,
      countInStock: countInStock ?? products[productIndex].countInStock,
      isFeatured: isFeatured ?? products[productIndex].isFeatured,
      brand: brand || products[productIndex].brand,
      isActive: isActive ?? products[productIndex].isActive
    };
    
    await writeProducts(products);
    res.json(products[productIndex]);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const products = await readProducts();
  const productIndex = products.findIndex(p => p._id === productId);

  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    await writeProducts(products);
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
  const products = await readProducts();
  res.status(200).json(products);
});