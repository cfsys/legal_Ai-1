const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

let isMongooseConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isMongooseConnected = true;
    return mongoose.connection;
  }

  const DEFAULT_ATLAS_URI = 'mongodb+srv://divya1505shah_db_user:Divya%4015@cluster0.5iymkof.mongodb.net/themes-ai?retryWrites=true&w=majority&appName=Cluster0';
  const mongoUri = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;
  const isAtlas = mongoUri.startsWith('mongodb+srv');
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: isAtlas ? 15000 : 2500,
      maxPoolSize: 25,
      minPoolSize: 5,
    });
    isMongooseConnected = true;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed: ${error.message}`);
    console.warn(`[Database] Operating in High-Performance Local Store mode.`);
    isMongooseConnected = false;
  }
};

const getIsMongooseConnected = () => isMongooseConnected;

module.exports = { connectDB, getIsMongooseConnected };
