import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingBag, Check, Droplets, Sun, Ruler, Leaf } from 'lucide-react';

const PlantCard = ({ product, index = 0, variant = 'default' }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef(null);

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay: index * 0.1
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px -4px rgba(45, 90, 39, 0.15)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: index * 0.1 + 0.2 }
    }
  };

  // Data handling
  const imageSrc = product.imageUrls?.[0] || product.images?.[0] || product.image || 'https://placehold.co/600x600?text=No+Image';
  const title = product.name || 'Unnamed Plant';
  
  const priceValue = product.price?.$numberDecimal || product.price;
  const price = typeof priceValue !== 'undefined' 
    ? `$${Number(priceValue).toFixed(2)}`
    : 'Price unavailable';

  const handleAddToCart = () => {
    if (added) return;
    addItem(product);
    setAdded(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Difficulty badge colors
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'very easy': return 'bg-botanical-light text-botanical-dark';
      case 'easy': return 'bg-botanical-medium text-white';
      case 'moderate': return 'bg-botanical-earth text-white';
      case 'difficult': return 'bg-red-400 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      className={`bg-white rounded-organic-lg shadow-soft overflow-hidden group flex flex-col h-full
        ${variant === 'featured' ? 'ring-2 ring-botanical-primary' : ''}`}
    >
      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-botanical-primary text-white text-xs px-3 py-1 rounded-organic-full font-medium">
            Featured
          </span>
        </div>
      )}

      {/* Image Section */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden">
        <motion.img
          variants={imageVariants}
          src={imageSrc}
          alt={title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/600x600?text=Plant+Image';
          }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-botanical-dark/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.span 
            className="bg-white text-botanical-primary py-2 px-6 rounded-organic-full font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.span>
        </div>

        {/* Pet Friendly Badge */}
        {product.petFriendly && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-organic-sm flex items-center gap-1">
              <Leaf size={12} />
              Pet Safe
            </span>
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-xs text-botanical-medium font-medium uppercase tracking-wide">
          {product.category}
        </span>

        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-serif font-semibold text-gray-800 mt-1 hover:text-botanical-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Difficulty Badge */}
        {product.difficulty && (
          <span className={`inline-block text-xs px-2 py-1 rounded-organic-sm mt-2 w-fit ${getDifficultyColor(product.difficulty)}`}>
            {product.difficulty}
          </span>
        )}

        {/* Plant Care Icons */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          {product.lightRequirements && (
            <div className="flex items-center gap-1" title={product.lightRequirements}>
              <Sun size={14} className="text-botanical-medium" />
              <span className="truncate max-w-[60px]">
                {product.lightRequirements.split(',')[0]}
              </span>
            </div>
          )}
          {product.wateringFrequency && (
            <div className="flex items-center gap-1" title={product.wateringFrequency}>
              <Droplets size={14} className="text-botanical-medium" />
              <span className="truncate max-w-[60px]">
                {product.wateringFrequency.split(',')[0]}
              </span>
            </div>
          )}
          {product.potSize && (
            <div className="flex items-center gap-1" title={product.potSize}>
              <Ruler size={14} className="text-botanical-medium" />
              <span>{product.potSize.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-serif font-bold text-botanical-primary">
            {price}
          </span>
          
          <motion.button
            onClick={handleAddToCart}
            disabled={added}
            className={`flex items-center gap-2 py-2 px-4 rounded-organic transition-all duration-300 ${
              added
                ? 'bg-botanical-primary text-white cursor-not-allowed'
                : 'bg-botanical-primary text-white hover:bg-botanical-dark'
            }`}
            whileHover={!added ? { scale: 1.05 } : {}}
            whileTap={!added ? { scale: 0.95 } : {}}
          >
            {added ? (
              <>
                <Check size={18} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlantCard;