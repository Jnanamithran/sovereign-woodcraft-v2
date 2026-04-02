import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Flower2, Trees, ArrowRight } from 'lucide-react';
import PlantCard from '../components/PlantCard';

// Read base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Category data for the categories section
const categories = [
  { name: 'Indoor Plants', icon: Leaf, description: 'Perfect for any room', color: 'bg-botanical-primary' },
  { name: 'Succulents', icon: Sprout, description: 'Low maintenance beauties', color: 'bg-botanical-moss' },
  { name: 'Flowering Plants', icon: Flower2, description: 'Blooms that inspire', color: 'bg-botanical-earth' },
  { name: 'Indoor Trees', icon: Trees, description: 'Make a statement', color: 'bg-botanical-dark' },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/products/featured`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
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

  return (
    <div className="bg-botanical-pale min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <motion.section 
        className="relative h-[80vh] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=1920')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-botanical-dark/70 via-botanical-primary/50 to-botanical-dark/70" />
        
        {/* Floating Leaves Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10"
              initial={{ 
                x: Math.random() * 100 - 50 + '%', 
                y: -100, 
                rotate: 0 
              }}
              animate={{ 
                y: '100vh', 
                rotate: 360 
              }}
              transition={{ 
                duration: 10 + Math.random() * 10, 
                repeat: Infinity, 
                delay: i * 2,
                ease: "linear"
              }}
              style={{ left: `${10 + i * 15}%` }}
            >
              <Leaf size={40 + Math.random() * 20} />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp}>
            <span className="text-botanical-light text-lg md:text-xl font-medium tracking-widest uppercase mb-4 block">
              Welcome to
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6"
            variants={scaleIn}
          >
            The Botanical Haven
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-8 font-light"
            variants={fadeInUp}
          >
            Bring nature indoors with our curated collection of plants
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <Link to="/shop">
              <motion.button 
                className="bg-white text-botanical-primary py-4 px-10 rounded-organic-full text-lg font-semibold hover:bg-botanical-pale transition duration-300 flex items-center gap-3 mx-auto shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Our Collection
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm tracking-widest">Scroll to explore</span>
        </motion.div>
      </motion.section>

      {/* Categories Section */}
      <section className="py-20 px-6 bg-white">
        <motion.div 
          className="container mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-serif font-bold text-center text-botanical-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Shop by Category
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Find the perfect plants for your space, from easy-care succulents to stunning flowering varieties
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                className="text-center p-6 rounded-organic-lg bg-botanical-pale hover:bg-botanical-light/20 transition-colors cursor-pointer group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <category.icon className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-botanical-dark mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-6 bg-botanical-pale">
        <motion.div 
          className="container mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-serif font-bold text-center text-botanical-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Plants
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Handpicked selections from our collection
          </motion.p>

          {loading ? (
            <div className="text-center py-12">
              <motion.div
                className="inline-block w-12 h-12 border-4 border-botanical-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-gray-600">Loading plants...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No featured products available at the moment.</p>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {featuredProducts.map((product, index) => (
                <PlantCard key={product._id} product={product} index={index} />
              ))}
            </motion.div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/shop">
              <motion.button 
                className="border-2 border-botanical-primary text-botanical-primary py-3 px-8 rounded-organic-full font-semibold hover:bg-botanical-primary hover:text-white transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Plants
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 bg-white">
        <motion.div 
          className="container mx-auto max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-serif font-bold text-center text-botanical-dark mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose The Botanical Haven?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Care Tips',
                description: 'Every plant comes with detailed care instructions to help your green friends thrive.',
                icon: '🌱'
              },
              {
                title: 'Quality Guaranteed',
                description: 'We carefully select and inspect each plant to ensure you receive only the healthiest specimens.',
                icon: '✨'
              },
              {
                title: 'Sustainable Practices',
                description: 'We use eco-friendly packaging and source from sustainable growers whenever possible.',
                icon: '🌍'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="text-center p-8 rounded-organic-lg bg-botanical-pale"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <span className="text-5xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-semibold text-botanical-dark mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;