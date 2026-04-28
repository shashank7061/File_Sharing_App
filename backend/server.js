const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST (before any other imports that use env vars)
dotenv.config();

const connectDB = require('./config/db.js');
const fileRoutes = require('./routes/fileRoutes.js');
const path = require('path');
const fs = require('fs');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174'
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any *.vercel.app preview deployments
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/files', fileRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    cloudinary: process.env.USE_CLOUDINARY === 'true' ? 'enabled' : 'disabled',
    email: process.env.BREVO_API_KEY ? 'brevo' : (process.env.RESEND_API_KEY ? 'resend' : (process.env.EMAIL_USER ? 'gmail-smtp' : 'not configured'))
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📁 Upload directory: ${uploadsDir}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`☁️  Cloudinary: ${process.env.USE_CLOUDINARY === 'true' ? 'ENABLED' : 'DISABLED'}`);
    console.log(`📧 Email: ${process.env.RESEND_API_KEY ? 'Resend API' : (process.env.EMAIL_USER ? 'Gmail SMTP (may be blocked)' : 'NOT CONFIGURED')}`);
    console.log(`\n✅ Server ready!\n`);
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});
