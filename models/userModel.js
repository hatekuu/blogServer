const connectDB = require('../config/db');

const getUserCollection = async () => {
  const db = await connectDB();
  return db.collection('users');
};

module.exports = { getUserCollection };
