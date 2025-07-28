import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogOut,
  Search,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { cartCount } = useCart();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
      setMobileSearchOpen(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <svg className="h-10 w-10 text-amber-800" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" />
            <path d="M2 7L12 12M22 7L12 12M12 22V12" stroke="currentColor" strokeWidth="2" />
            <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="text-2xl font-bold text-amber-800 hidden sm:inline">Sovereign Woodcraft</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-amber-600">Home</Link>
          <Link to="/shop" className="text-gray-700 hover:text-amber-600">Shop</Link>
          <Link to="/about" className="text-gray-700 hover:text-amber-600">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-amber-600">Contact</Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-3 sm:space-x-4" ref={dropdownRef}>
          {/* Mobile Search Icon */}
          <button
            className="lg:hidden text-gray-700 hover:text-amber-600 p-2"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <Search size={24} />
          </button>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="py-2 pl-4 pr-10 w-40 lg:w-56 rounded-full border border-gray-300 bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="h-5 w-5 text-gray-400 hover:text-amber-700" />
            </button>
          </form>

          {/* Cart Icon */}
          <Link to="/cart" className="relative text-gray-700 hover:text-amber-600 p-2 rounded-full hover:bg-gray-100">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Info or Login */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center text-gray-700 hover:text-amber-600"
              >
                {/* Mobile: Show User Icon */}
                <span className="sm:hidden p-2">
                  <User size={24} />
                </span>
                
                {/* Desktop: Show Name and Chevron */}
                <span className="hidden sm:flex items-center">
                  <span>Hi, {userInfo.name.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md z-50">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Your Orders</Link>
                  <Link to="/address" className="block px-4 py-2 hover:bg-gray-100">Your Address</Link>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center text-gray-700 hover:text-amber-600">
              <User size={24} />
              <span className="ml-2 hidden sm:inline">Login</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-gray-700 hover:text-amber-600 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-2">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </form>
        </div>
      )}

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t px-4 py-3 space-y-2">
          <Link to="/" className="block text-gray-700 hover:text-amber-600">Home</Link>
          <Link to="/shop" className="block text-gray-700 hover:text-amber-600">Shop</Link>
          <Link to="/about" className="block text-gray-700 hover:text-amber-600">About</Link>
          <Link to="/contact" className="block text-gray-700 hover:text-amber-600">Contact</Link>
        </div>
      )}
    </header>
  );
};

export default Header;