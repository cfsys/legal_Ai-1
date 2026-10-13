const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

let isMongooseConnected = false;
let currentDbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/themes-ai';

const connectDB = async (customUri) => {
  const mongoUri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/themes-ai';
  currentDbUri = mongoUri;
  const isAtlas = mongoUri.startsWith('mongodb+srv');

  try {
    if (mongoose.connection.readyState === 1) {
      isMongooseConnected = true;
      return { success: true, host: mongoose.connection.host };
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: isAtlas ? 15000 : 2500,
      maxPoolSize: 25,
      minPoolSize: 5,
    });
    isMongooseConnected = true;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return { success: true, host: conn.connection.host };
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed: ${error.message}`);
    console.warn(`[Database] Operating in High-Performance Local Store mode.`);
    isMongooseConnected = false;
    return { success: false, error: error.message };
  }
};

const getIsMongooseConnected = () => mongoose.connection.readyState === 1 || isMongooseConnected;
const getCurrentDbUri = () => currentDbUri || process.env.MONGODB_URI;

module.exports = { connectDB, getIsMongooseConnected, getCurrentDbUri };
