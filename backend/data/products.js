import mongoose from 'mongoose';

// Sample product data for seeding the database
const products = [
  {
    name: "Handcrafted Oak Dining Table",
    imageUrls: [
      "https://images.unsplash.com/photo-1530018607912-eff46a21742f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1530018607912-eff46a21742f?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Dining Furniture",
    description: "A beautifully crafted solid oak dining table with a natural finish. Perfect for family gatherings and special occasions. Handmade with attention to detail and built to last for generations.",
    price: 1299.99,
    countInStock: 5,
    rating: 4.8,
    numReviews: 24,
    isActive: true,
    isFeatured: true
  },
  {
    name: "Modern Walnut Coffee Table",
    imageUrls: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Living Room Furniture",
    description: "Sleek and modern coffee table made from premium walnut wood. Features clean lines and a smooth finish that complements any contemporary living space.",
    price: 799.99,
    countInStock: 8,
    rating: 4.6,
    numReviews: 15,
    isActive: true,
    isFeatured: true
  },
  {
    name: "Rustic Pine Bookshelf",
    imageUrls: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Storage Furniture",
    description: "A sturdy pine bookshelf with a rustic charm. Perfect for displaying your favorite books and decorative items. Each shelf is unique with natural wood grain patterns.",
    price: 499.99,
    countInStock: 12,
    rating: 4.4,
    numReviews: 32,
    isActive: true,
    isFeatured: false
  },
  {
    name: "Elegant Cherry Wood Desk",
    imageUrls: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Office Furniture",
    description: "A sophisticated cherry wood desk perfect for your home office. Features ample workspace and a timeless design that will enhance any professional setting.",
    price: 899.99,
    countInStock: 6,
    rating: 4.7,
    numReviews: 18,
    isActive: true,
    isFeatured: true
  },
  {
    name: "Cozy Maple Rocking Chair",
    imageUrls: [
      "https://images.unsplash.com/photo-1578898889136-6b9e68a500e1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1578898889136-6b9e68a500e1?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Living Room Furniture",
    description: "A comfortable maple rocking chair with ergonomic design. Perfect for reading, relaxing, or enjoying a quiet moment. Handcrafted for durability and comfort.",
    price: 649.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 28,
    isActive: true,
    isFeatured: false
  },
  {
    name: "Minimalist Teak Side Table",
    imageUrls: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Living Room Furniture",
    description: "A minimalist side table made from sustainably sourced teak. Its simple design makes it versatile for any room in your home.",
    price: 299.99,
    countInStock: 15,
    rating: 4.3,
    numReviews: 22,
    isActive: true,
    isFeatured: false
  },
  {
    name: "Traditional Mahogany Wardrobe",
    imageUrls: [
      "https://images.unsplash.com/photo-1618229395435-864d2a7f4209?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1618229395435-864d2a7f4209?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Bedroom Furniture",
    description: "A classic mahogany wardrobe with ample storage space. Features solid construction and timeless design that will never go out of style.",
    price: 1599.99,
    countInStock: 3,
    rating: 4.9,
    numReviews: 12,
    isActive: true,
    isFeatured: true
  },
  {
    name: "Contemporary Birch TV Stand",
    imageUrls: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Entertainment Furniture",
    description: "A modern TV stand made from birch wood. Features clean lines and functional storage for your entertainment center needs.",
    price: 549.99,
    countInStock: 9,
    rating: 4.2,
    numReviews: 19,
    isActive: true,
    isFeatured: false
  },
  {
    name: "Artisanal Cedar Chest",
    imageUrls: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Storage Furniture",
    description: "A handcrafted cedar chest perfect for storing blankets, linens, or keepsakes. The natural cedar scent helps repel moths and keeps contents fresh.",
    price: 749.99,
    countInStock: 7,
    rating: 4.6,
    numReviews: 16,
    isActive: true,
    isFeatured: true
  },
  {
    name: "Industrial Reclaimed Wood Bench",
    imageUrls: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    brand: "Sovereign Woodcraft",
    category: "Entryway Furniture",
    description: "A sturdy bench made from reclaimed wood with industrial metal legs. Perfect for entryways, providing both seating and storage space.",
    price: 399.99,
    countInStock: 11,
    rating: 4.4,
    numReviews: 25,
    isActive: true,
    isFeatured: false
  }
];

export default products;