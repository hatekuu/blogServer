const { getPostCollection } = require('../models/postModel');
const { ObjectId } = require('mongodb');

// 🆕 Tạo post
const createPost = async (req, res) => {
  const { title, sections } = req.body;
  const user = req.user;

  if (!title || !Array.isArray(sections) || sections.length === 0) {
    return res.status(400).json({ message: 'Title and sections are required' });
  }

  try {
    const posts = await getPostCollection();

    const newPost = {
      title,
      author: {
        id: user.id,
        username: user.username,
      },
      createdAt: new Date(),
      sections,
    };

    const result = await posts.insertOne(newPost);
    res.status(201).json({ message: 'Post created successfully', postId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// 📥 Lấy tất cả post
const getAllPosts = async (req, res) => {
  try {
    const posts = await getPostCollection();
    const result = await posts.find().sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// 📄 Lấy post theo ID
const getPostById = async (req, res) => {
  try {
    const posts = await getPostCollection();
    const post = await posts.findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✏️ Cập nhật post (sử dụng cấu trúc sections)
const updatePost = async (req, res) => {
  const { title, sections } = req.body;
   const user = req.user;
   if(!user){return res.status(402).json({ message: 'not authenticated' });}
  try {
    const posts = await getPostCollection();
      const post = await posts.findOne({ 
    _id: new ObjectId(req.params.id),
    "author.id": user.id 
  });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const updated = {
      ...(title && { title }),
      ...(sections && Array.isArray(sections) && { sections }),
      updatedAt: new Date(), // nếu muốn theo dõi thời gian chỉnh sửa
    };

    await posts.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updated }
    );

    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ❌ Xóa post
const deletePost = async (req, res) => {
  try {
    const posts = await getPostCollection();
    const result = await posts.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
