// run: npm run seed-admin
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
(async function(){
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'admin@college.edu' });
  if(exists) { console.log('Admin exists'); process.exit(0); }
  const hash = await bcrypt.hash('admin', 10);
  const admin = new User({ name: 'Admin', email: 'admin@rgukt', passwordHash: hash, role: 'admin', isVerified: true });
  await admin.save();
  console.log('Admin created: admin@rgukt / admin');
  process.exit(0);
})();
