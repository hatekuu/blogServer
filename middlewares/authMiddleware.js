const jwt = require('jsonwebtoken');
const { getBlacklistCollection } = require('../models/blacklistModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // Kiểm tra token có nằm trong blacklist không
    const blacklist = await getBlacklistCollection();
    const blacklisted = await blacklist.findOne({ token });

    if (blacklisted) return res.status(403).json({ message: 'Token is blacklisted' });

    // Xác minh token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
