import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Read base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
    <div className="relative">
      <img
        src={product.images?.[0] || 'https://placehold.co/600x400?text=No+Image'}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link
          to={`/product/${product._id}`}
          className="bg-amber-700 text-white py-2 px-6 rounded-full transform hover:scale-105 transition-transform"
        >
          View Details
        </Link>
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-gray-700 mt-1">${Number(product.price?.$numberDecimal || product.price).toFixed(2)}</p>
    </div>
  </div>
);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/products/featured`);
        setFeaturedProducts(data);
      } catch (err) {
        console.error('Failed to load featured products', err);
        setError('Could not load featured products. Please try again later.');
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const renderContent = () => {
    if (loading) return <p className="text-center">Loading products...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (featuredProducts.length === 0)
      return <p className="text-center">No featured products available at the moment.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {featuredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50">
      <main>
        <section
          className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative text-center z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Timeless Furniture, Handcrafted for You</h1>
            <p className="text-lg md:text-xl mb-8">Discover pieces that tell a story.</p>
            <Link to="/shop">
              <button className="bg-amber-700 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-amber-800 transition duration-300">
                Explore Our Collection
              </button>
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Featured Products</h2>
            {renderContent()}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
