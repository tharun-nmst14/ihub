import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { authMiddleware } from '../utils/middleware.js';

const router = express.Router();

/**
 * Multer setup (memory storage)
 * We do NOT save files to disk
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * POST /api/upload
 * Upload single image
 */
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    try {
      // console.log('UPLOAD HIT');
      // console.log('File:', req.file?.originalname);
      // console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);

      if (!req.file) {
        return res.status(400).json({ message: 'No image provided' });
      }

      cloudinary.uploader.upload_stream(
        { folder: 'ihub' },
        (error, result) => {
          if (error) {
            console.error('CLOUDINARY ERROR →', error);
            return res.status(500).json({ message: 'Cloudinary upload failed' });
          }

          // console.log('UPLOAD SUCCESS');
          res.json({ url: result.secure_url });
        }
      ).end(req.file.buffer);

    } catch (err) {
      console.error('UPLOAD ROUTE ERROR →', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


export default router;
