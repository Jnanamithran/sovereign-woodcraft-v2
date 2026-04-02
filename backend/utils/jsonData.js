import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');

// Helper function to read JSON file
export const readJsonFile = async (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// Helper function to write JSON file
export const writeJsonFile = async (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Products
export const getProducts = () => readJsonFile('products.json');
export const writeProducts = (products) => writeJsonFile('products.json', products);

// Users
export const getUsers = () => readJsonFile('users.json');
export const writeUsers = (users) => writeJsonFile('users.json', users);

// Orders
export const getOrders = () => readJsonFile('orders.json');
export const writeOrders = (orders) => writeJsonFile('orders.json', orders);

// Logs
export const getLogs = () => readJsonFile('logs.json');
export const writeLogs = (logs) => writeJsonFile('logs.json', logs);