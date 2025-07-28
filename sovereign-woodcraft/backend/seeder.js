// /backend/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/ProductModel.js'; // Create this model if not already
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const sampleProducts = [ /* paste above JSON here */ ];

const importData = async () => {
  try {
    await Product.deleteMany(); // Optional: clean existing products
    await Product.insertMany(sampleProducts);
    console.log('Sample products imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
