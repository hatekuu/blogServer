const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Kết nối DB
connectDB();

// Router
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
