// server/src/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectDB(){
  const uri = process.env.MONGO_URI;
  if(!uri) throw new Error('MONGO_URI missing in .env');

  // In mongoose v7 and mongodb driver v5+, the old options like
  // useNewUrlParser and useUnifiedTopology are removed.
  // Call mongoose.connect(uri) without those legacy options.
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
