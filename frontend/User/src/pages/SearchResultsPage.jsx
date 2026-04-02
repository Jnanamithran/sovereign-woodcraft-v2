import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { Search } from 'lucide-react';

// --- MOCK DATA - In a real app, this would come from a central place or API ---
const allProducts = [
  { id: 1, name: 'Handcrafted Oak Chair', price: 180.00, category: 'Chairs', imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80' },
  { id: 2, name: 'Artisan Walnut Table', price: 750.00, category: 'Tables', imageUrl: 'https://images.unsplash.com/photo-1604074131665-7a5d83a54e35?auto=format&fit=crop&q=80' },
  { id: 3, name: 'Minimalist Pine Shelf', price: 95.00, category: 'Shelving', imageUrl: 'https://images.unsplash.com/photo-1594894489684-9e05c6d3e1fd?auto=format&fit=crop&q=80' },
  { id: 4, name: 'Rustic Wooden Stool', price: 75.00, category: 'Chairs', imageUrl: 'https://images.unsplash.com/photo-1573070476230-952a2f862744?auto=format&fit=crop&q=80' },
  { id: 5, name: 'Modern Cedar Desk', price: 450.00, category: 'Tables', imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f82d7a?auto=format&fit=crop&q=80' },
  { id: 6, name: 'Floating Oak Shelves', price: 120.00, category: 'Shelving', imageUrl: 'https://images.unsplash.com/photo-1600375992853-3b67958b21d7?auto=format&fit=crop&q=80' },
  { id: 7, name: 'Leather & Oak Lounge Chair', price: 320.00, category: 'Chairs', imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80' },
  { id: 8, name: 'Large Farmhouse Dining Table', price: 980.00, category: 'Tables', imageUrl: 'https://images.unsplash.com/photo-1511203381168-a45483b4a243?auto=format&fit=crop&q=80' },
];

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // Get the search query from the URL (?q=...)

  // Filter products based on the query. useMemo prevents re-calculating on every render.
  const filteredProducts = useMemo(() => {
    if (!query) {
      return [];
    }
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Search Results</h1>
        {query && (
          <p className="text-lg text-gray-600 mt-2">
            Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for <span className="font-semibold text-amber-800">"{query}"</span>
          </p>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <Search size={64} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">No products found</h2>
          <p className="mt-2 text-gray-500">We couldn't find anything matching your search. Try a different term.</p>
          <Link 
            to="/shop" 
            className="mt-6 inline-block bg-amber-700 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-amber-800 transition duration-300"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
