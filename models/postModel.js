const connectDB = require('../config/db');

const getPostCollection = async () => {
  const db = await connectDB();
  return db.collection('posts');
};

module.exports = { getPostCollection };
