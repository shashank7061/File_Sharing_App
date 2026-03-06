const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    default: null
  },
  isCloudinary: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for automatic deletion of expired files
fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('File', fileSchema);
