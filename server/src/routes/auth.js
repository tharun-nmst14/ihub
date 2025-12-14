import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// register
router.post('/register', async (req, res)=>{
  const { name, email, password, department } = req.body;
  if(!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const existing = await User.findOne({ email });
  if(existing) return res.status(400).json({ message: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, passwordHash: hash, department, isVerified: false });
  await user.save();
  return res.json({ message: 'Registered, wait for admin verification' });
});

// login
router.post('/login', async (req, res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(400).json({ message: 'Invalid credentials' });
  // create token payload
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role, isVerified: user.isVerified }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } });
});

export default router;
