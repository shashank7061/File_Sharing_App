const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadFile,
  downloadFile,
  sendEmailWithLink
} = require('../controllers/fileController');

// Upload file
router.post('/upload', upload.single('file'), uploadFile);

// Download file
router.get('/download/:id', downloadFile);

// Send email
router.post('/send-email', sendEmailWithLink);

module.exports = router;
