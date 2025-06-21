// config/db.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let db = null;

const connectDB = async () => {
  if (db) return db;

  try {
    const client = new MongoClient(uri); 
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB database: ${dbName}`);
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
