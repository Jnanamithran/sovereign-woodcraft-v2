import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const categories = ['All', 'Chairs', 'Tables', 'Shelving'];
const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(data);
      } catch (err) {
        setError('Could not fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (filterCategory !== 'All') {
      result = result.filter(p => p.category === filterCategory);
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, filterCategory, sortOrder]);

  if (loading) {
    return <div className="text-center py-20">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Our Collection</h1>
        <p className="text-lg text-gray-600 mt-2">
          Explore our handcrafted furniture, designed to last a lifetime.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter toggle for mobile */}
        <div className="lg:hidden flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sidebar Filter */}
        <aside
          className={`lg:w-1/4 lg:block ${
            isSidebarOpen ? 'block' : 'hidden'
          } fixed lg:relative top-0 left-0 w-3/4 h-full bg-white z-20 p-6 lg:p-0 shadow-lg lg:shadow-none transition-transform`}
        >
          <div className="flex justify-between items-center lg:hidden mb-6">
            <h3 className="text-xl font-bold">Filters</h3>
            <button onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setFilterCategory(category);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    filterCategory === category
                      ? 'bg-amber-100 text-amber-800 font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <main className="w-full lg:w-3/4">
          <div className="hidden lg:flex justify-end mb-4">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-700">No Products Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
