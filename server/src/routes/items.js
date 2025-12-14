import express from 'express';
import Item from '../models/Item.js';
import { authMiddleware } from '../utils/middleware.js';

const router = express.Router();

/* =====================================================
   PUBLIC: Browse active items (no login required)
===================================================== */
router.get('/', async (req, res) => {
  try {
    const q = { status: 'active' };

    if (req.query.category) {
      q.category = req.query.category;
    }

    const items = await Item.find(q)
      .populate('seller', 'name email department');

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

/* =====================================================
   CREATE ITEM: Verified users only
===================================================== */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Verify account first' });
    }

    const { title, description, category, price, condition, images } = req.body;

  const item = new Item({
  title,
  description,
  category,
  price,
  condition,
  images: images || [],
  seller: req.user.id
});


    await item.save();
    res.json(item);

  } catch (err) {
    res.status(500).json({ message: 'Failed to create item' });
  }
});

/* =====================================================
   MARK ITEM AS SOLD (OWNER ONLY)
===================================================== */
router.patch('/:id/sold', authMiddleware, async (req, res) => {
  // console.log('SOLD HIT:', req.params.id, req.body, req.user.id);
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  if (item.seller.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { buyerStudentId } = req.body; // ✅ NEW

  item.status = 'sold';
  item.soldAt = new Date();
  item.buyerStudentId = buyerStudentId || null; // ✅ NEW

  await item.save();

  res.json({ message: 'Item marked as sold' });
});


/* =====================================================
   REMOVE ITEM (OWNER OR ADMIN) - SOFT DELETE
===================================================== */
router.delete('/:id', authMiddleware, async (req, res) => {
  // console.log('DELETE HIT:', req.params.id, req.user.id);
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const isOwner = item.seller.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // 🔥 HARD DELETE FROM DATABASE
    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item permanently deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item permanently' });
  }
});


// GET items of logged-in user (dashboard)
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user.id })
      .populate('seller', 'name email department');

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your items' });
  }
});

// UPDATE ITEM (OWNER ONLY)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // only owner can edit
    if (item.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

const { title, description, category, price, condition, images } = req.body;

    item.title = title;
    item.description = description;
    item.category = category;
    item.price = price;
    item.condition = condition;
    item.images=images;
    await item.save();
    res.json(item);

  } catch (err) {
    res.status(500).json({ message: 'Failed to update item' });
  }
});


export default router;
