import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/ProductModel.js';
import products from './data/products.js'; // Your product seed data

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany(); // optional: clean existing data
    await Product.insertMany(products);
    console.log('✅ Data seeded');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
