const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
