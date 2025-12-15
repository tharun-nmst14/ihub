import express from 'express';
import Suggestion from '../models/Suggestion.js';
import { authMiddleware } from '../utils/middleware.js';

const router = express.Router();

/* PUBLIC: submit suggestion */
router.post('/', async (req, res) => {
  try {
    const { name, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Suggestion is required' });
    }

    const suggestion = new Suggestion({
      name: name || 'Anonymous',
      message
    });

    await suggestion.save();
    res.json({ message: 'Suggestion submitted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to submit suggestion' });
  }
});

/* ADMIN: view all suggestions */
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }

  const suggestions = await Suggestion.find().sort({ createdAt: -1 });
  res.json(suggestions);
});

export default router;
