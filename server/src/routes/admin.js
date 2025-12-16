import express from 'express';
import User from '../models/User.js';
import Item from '../models/Item.js';
import { authMiddleware, adminOnly } from '../utils/middleware.js';

const router = express.Router();

// admin-only list users
router.get('/users', authMiddleware, adminOnly, async (req, res)=>{
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

// verify user
// router.post('/users/:id/verify', authMiddleware, adminOnly, async (req, res)=>{
//   const user = await User.findById(req.params.id);
//   if(!user) return res.status(404).json({ message: 'No user' });
//   user.isVerified = true;
//   await user.save();
//   res.json({ message: 'Verified' });
// });

// admin list items
router.get('/items', authMiddleware, adminOnly, async (req, res)=>{
  const items = await Item.find().populate('seller','name email');
  res.json(items);
});

// GET SOLD ITEMS (ADMIN)
router.get('/sold-items', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }

  const items = await Item.find({ status: 'sold' })
    .populate('seller', 'name email department')
    .sort({ soldAt: -1 });

  res.json(items);
});

export default router;
