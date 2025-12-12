import express from 'express';
import {
  uploadProfilePhoto,
  uploadTaskImages,
  uploadPostImages,
  uploadMessageMedia
} from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/profile', verifyToken, upload.single('file'), uploadProfilePhoto);
router.post('/task', verifyToken, upload.array('files', 5), uploadTaskImages);
router.post('/post', verifyToken, upload.array('files', 5), uploadPostImages);
router.post('/message', verifyToken, upload.single('file'), uploadMessageMedia);

export default router;
