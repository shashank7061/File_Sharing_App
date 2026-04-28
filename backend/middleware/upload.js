const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

let storage;

if (useCloudinary) {
  // When using Cloudinary, use memory storage so we can upload the buffer
  // to Cloudinary manually in the controller (avoids multer-storage-cloudinary
  // version incompatibility with cloudinary v2)
  storage = multer.memoryStorage();
  console.log('✨ Using Cloudinary storage (via memory buffer)');
} else {
  // Local Storage Configuration
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      cb(null, uploadsDir);
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
  // Accept all file types
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
