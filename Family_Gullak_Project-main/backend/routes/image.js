const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Use your Cloudinary library
const Image = require('../models/Image'); // Your MongoDB schema

const router = express.Router();

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary configuration (You should provide your own Cloudinary credentials)
cloudinary.config({
  cloud_name: 'dgmkwv786',
  api_key: '729145925449238',
  api_secret: 'ZZFRfM0dFl9dptcs5kqd1pxr974',
});

// Upload an image to Cloudinary and save the image URL to MongoDB
router.post('/upload', upload.array('image'  ,10), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.buffer, {
      folder: 'your_folder_name', // Optional, to organize images in Cloudinary
    });

    // Save image data to MongoDB
    const { secure_url, public_id } = result;
    const image = new Image({
      imageUrl: secure_url 
    });
    console.log(imageUrl);

    // If you have user authentication, associate the image with the user
    if (req.user) {
      image.uploadedBy = req.user._id;
      console.log(req.user._id);
    }

    await image.save();

    res.status(201).json({ message: 'Image uploaded successfully', image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Retrieve a list of images
router.get('/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
