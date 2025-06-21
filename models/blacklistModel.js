const connectDB = require('../config/db');

const getBlacklistCollection = async () => {
  const db = await connectDB();
  return db.collection('blacklist');
};

module.exports = { getBlacklistCollection };
