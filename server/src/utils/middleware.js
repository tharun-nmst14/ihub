import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';

export function authMiddleware(req, res, next){
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  if(!token) return res.status(401).json({ message: 'No token' });
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function adminOnly(req, res, next){
  if(!req.user) return res.status(401).json({ message: 'No user' });
  if(req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}
