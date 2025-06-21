const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserCollection } = require('../models/userModel');
const { getBlacklistCollection } = require('../models/blacklistModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await getUserCollection();
    const existingUser = await users.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body
  try {
    const users = await getUserCollection();
    const user = await users.findOne({ username });
    const userId=user._id
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token,userId,username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const logout = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token found' });

  const blacklist = await getBlacklistCollection();
  await blacklist.insertOne({ token });

  res.json({ message: 'Logged out successfully' });
};

const getProfile = async (req, res) => {
  try {
    res.json({ message: 'Authorized', user: req.user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, logout, getProfile };
