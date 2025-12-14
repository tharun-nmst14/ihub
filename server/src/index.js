import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import cors from 'cors';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.js';
import itemsRouter from './routes/items.js';
import adminRouter from './routes/admin.js';
import conversationRoutes from './routes/Conversations.js';
import uploadRoutes from './routes/upload.js';

const app = express();
app.use(express.json());

// allow CORS from frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/admin', adminRouter);

app.use('/api/conversations', conversationRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(()=> {
  app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
}).catch(err => {
  console.error(err);
  process.exit(1);
});
