import express from 'express';
import Conversation from '../models/Conversation.js';
import Item from '../models/Item.js';
import { authMiddleware } from '../utils/middleware.js';

const router = express.Router();

/**
 * CREATE or GET conversation for an item
 * Buyer initiates chat with owner
 */
router.post('/:itemId', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId).populate('seller');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // item must be active
    if (item.status !== 'active') {
      return res.status(400).json({ message: 'Item is not available for chat' });
    }

    // owner cannot chat with self
    if (item.seller._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    // check if conversation already exists
    let conversation = await Conversation.findOne({
      item: item._id,
      buyer: req.user.id
    });

    if (!conversation) {
      conversation = await Conversation.create({
        item: item._id,
        owner: item.seller._id,
        buyer: req.user.id,
        messages: []
      });
    }

    res.json(conversation);

  } catch (err) {
    res.status(500).json({ message: 'Failed to create conversation' });
  }
});

/**
 * GET my conversations (buyer or owner)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      $or: [
        { buyer: userId },
        { owner: userId }
      ]
    })
      .populate('item', 'title')
      .populate('buyer', 'name email')
      .populate('owner', 'name email')
      .sort({ updatedAt: -1 });

    res.json(conversations);

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

/**
 * GET one conversation with messages
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('item', 'title')
      .populate('buyer', 'name email')
      .populate('owner', 'name email')
      .populate('messages.sender', 'name email');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const userId = req.user.id;

    // privacy check
    if (
      conversation.buyer._id.toString() !== userId &&
      conversation.owner._id.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(conversation);

  } catch (err) {
    res.status(500).json({ message: 'Failed to load conversation' });
  }
});

/**
 * SEND message in a conversation
 */
router.post('/:id/message', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const userId = req.user.id;

    // privacy check
    if (
      conversation.buyer.toString() !== userId &&
      conversation.owner.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    conversation.messages.push({
      sender: userId,
      text: text.trim()
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({ message: 'Message sent successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

export default router;
