const File = require('../models/File');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/sendEmail.js');
const cloudinary = require('../config/cloudinary.js');

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const expiryHours = parseInt(req.body.expiryHours) || parseInt(process.env.FILE_EXPIRY_HOURS) || 24;
    
    let expiresAt = null;
    if (expiryHours > 0) {
      expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    }

    const uuid = uuidv4();

    const filePath = useCloudinary ? req.file.path : req.file.path; // Cloudinary returns secure_url in path
    const cloudinaryId = useCloudinary && req.file.filename ? req.file.filename : null;

    const file = await File.create({
      filename: req.file.filename || req.file.originalname,
      originalName: req.file.originalname,
      path: filePath,
      cloudinaryId: cloudinaryId,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uuid: uuid,
      expiresAt: expiresAt,
      isCloudinary: useCloudinary
    });

    const downloadLink = `${process.env.BASE_URL}/api/files/download/${uuid}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: uuid,
        filename: file.originalName,
        size: file.size,
        downloadLink: downloadLink,
        expiresAt: file.expiresAt,
        storage: useCloudinary ? 'cloudinary' : 'local'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    if (req.file) {
      if (useCloudinary && req.file.filename) {
        cloudinary.uploader.destroy(req.file.filename, (err) => {
          if (err) console.error('Error deleting from Cloudinary:', err);
        });
      } else if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findOne({ uuid: id });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found or has expired'
      });
    }

    if (file.expiresAt && new Date() > file.expiresAt) {
      if (file.isCloudinary && file.cloudinaryId) {
        cloudinary.uploader.destroy(file.cloudinaryId, (err) => {
          if (err) console.error('Error deleting expired file from Cloudinary:', err);
        });
      } else if (fs.existsSync(file.path)) {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting expired file:', err);
        });
      }
      await File.deleteOne({ uuid: id });
      
      return res.status(410).json({
        success: false,
        message: 'File has expired'
      });
    }

    file.downloadCount += 1;
    await file.save();

    if (file.isCloudinary) {
      return res.redirect(file.path);
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Send file
    res.download(file.path, file.originalName, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error downloading file'
          });
        }
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file',
      error: error.message
    });
  }
};

exports.sendEmailWithLink = async (req, res) => {
  try {
    const { fileId, senderEmail, receiverEmail, message } = req.body;

    // Validation
    if (!fileId || !senderEmail || !receiverEmail) {
      return res.status(400).json({
        success: false,
        message: 'File ID, sender email, and receiver email are required'
      });
    }

    // Find file
    const file = await File.findOne({ uuid: fileId });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if expired
    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(410).json({
        success: false,
        message: 'File has expired'
      });
    }

    const downloadLink = `${process.env.BASE_URL}/api/files/download/${fileId}`;

    // Format expiry date
    const expiryText = file.expiresAt 
      ? `This link will expire on ${new Date(file.expiresAt).toLocaleString()}.`
      : 'This link has no expiration date.';

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .file-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>🔗 You've received a file!</h2>
            <p><strong>${senderEmail}</strong> has shared a file with you.</p>
            
            ${message ? `<p><em>"${message}"</em></p>` : ''}
            
            <div class="file-info">
              <p><strong>File Name:</strong> ${file.originalName}</p>
              <p><strong>File Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
              <p><strong>Expires:</strong> ${expiryText}</p>
            </div>
            
            <p>Click the button below to download:</p>
            <a href="${downloadLink}" class="button">Download File</a>
            
            <p style="color: #666; font-size: 14px;">
              Or copy this link: <br/>
              <a href="${downloadLink}">${downloadLink}</a>
            </p>
            
            <div class="footer">
              <p>This is an automated email from Secure File Share System.</p>
              <p>If you believe you received this email in error, please ignore it.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await sendEmail({
      to: receiverEmail,
      subject: `${senderEmail} shared a file with you`,
      html: emailHTML
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
};
