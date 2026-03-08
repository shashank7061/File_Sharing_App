const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../config/cloudinary.js');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

let storage;

if (useCloudinary) {
  // Cloudinary Storage Configuration
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'file-share-uploads',
      resource_type: 'auto',
      public_id: (req, file) => {
        const uniqueName = `${uuidv4()}-${Date.now()}`;
        return uniqueName;
      },
    },
  });
  console.log('✨ Using Cloudinary storage');
} else {
  // Local Storage Configuration
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });
  console.log('📁 Using local storage');
}

// File filter
const fileFilter = (req, file, cb) => {
  // You can add file type restrictions here if needed
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  }
});

module.exports = upload;
