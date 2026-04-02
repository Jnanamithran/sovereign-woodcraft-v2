import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext.jsx';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import ProductReviews from '../components/ProductReviews';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product', err);
        setError('Could not load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    // You could add a toast notification here
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  if (loading) return <div className="text-center py-8">Loading product...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  const price = product.price?.$numberDecimal ? parseFloat(product.price.$numberDecimal) : product.price;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.imageUrls?.[selectedImage] || 'https://placehold.co/600x600?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.imageUrls && product.imageUrls.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.imageUrls.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                          selectedImage === index ? 'ring-2 ring-amber-500' : ''
                        }`}
                      >
                        <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6 mt-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="ml-1 text-gray-600">{product.rating || 0} ({product.numReviews || 0} reviews)</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{product.brand || 'Sovereign Woodcraft'}</span>
                  </div>
                </div>

                <div className="text-2xl font-bold text-amber-700">${price.toFixed(2)}</div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Category</h3>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{product.category}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Availability</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {product.countInStock > 0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                          className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                          disabled={quantity >= product.countInStock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex items-center bg-amber-700 text-white px-6 py-3 rounded-full hover:bg-amber-800 transition-colors"
                      >
                        <ShoppingCart size={20} className="mr-2" />
                        Add to Cart
                      </button>
                      <button
                        onClick={handleBuyNow}
                        className="flex items-center bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Reviews */}
          <div>
            <ProductReviews 
              productId={id} 
              initialReviews={[]} 
              initialStats={{ 
                averageRating: product.rating || 0, 
                totalReviews: product.numReviews || 0 
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;