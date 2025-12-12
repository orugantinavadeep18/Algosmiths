import ImageKit from 'imagekit';
import { asyncHandler } from '../middleware/errorHandler.js';

let imagekit = null;

const getImageKit = () => {
  if (!imagekit) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
  }
  return imagekit;
};

export const uploadProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }
  
  const response = await getImageKit().upload({
    file: req.file.buffer,
    fileName: `profile-${req.userId}-${Date.now()}.jpg`,
    folder: '/snufix/profiles'
  });
  
  res.json({
    success: true,
    message: 'Profile photo uploaded',
    url: response.url
  });
});

export const uploadTaskImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files provided' });
  }
  
  const urls = [];
  
  for (const file of req.files) {
    const response = await getImageKit().upload({
      file: file.buffer,
      fileName: `task-${req.userId}-${Date.now()}.jpg`,
      folder: '/snufix/tasks'
    });
    urls.push(response.url);
  }
  
  res.json({
    success: true,
    message: 'Images uploaded',
    urls
  });
});

export const uploadPostImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files provided' });
  }
  
  const urls = [];
  
  for (const file of req.files) {
    const response = await getImageKit().upload({
      file: file.buffer,
      fileName: `post-${req.userId}-${Date.now()}.jpg`,
      folder: '/snufix/posts'
    });
    urls.push(response.url);
  }
  
  res.json({
    success: true,
    message: 'Post images uploaded',
    urls
  });
});

export const uploadMessageMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }
  
  const response = await getImageKit().upload({
    file: req.file.buffer,
    fileName: `message-${req.userId}-${Date.now()}`,
    folder: '/snufix/messages'
  });
  
  res.json({
    success: true,
    message: 'Media uploaded',
    url: response.url
  });
});
