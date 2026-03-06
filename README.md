# 🔐 Secure File Share System

A full-stack web application for secure file sharing with email notifications, unique download links, and optional file expiry.

## ✨ Features

- 📤 **File Upload** - Upload files with drag & drop support
- 🔗 **Unique Download Links** - Generate unique UUID-based download links
- 📧 **Email Notifications** - Send download links via email
- ⏰ **File Expiry** - Optional automatic file expiration
- 📏 **File Size Validation** - Configurable file size limits
- 🎨 **Modern UI** - Responsive React interface
- 🔒 **Secure** - File access control and validation

## 🛠️ Tech Stack

### Frontend
- **React** + **Vite** - Fast and modern development
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** + **Express** - RESTful API
- **MongoDB** + **Mongoose** - Database
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **UUID** - Unique link generation
- **Dotenv** - Environment variables

## 📁 Project Structure

```
File_share/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── fileController.js
│   ├── middleware/
│   │   └── upload.js
│   ├── models/
│   │   └── File.js
│   ├── routes/
│   │   └── fileRoutes.js
│   ├── uploads/              # File storage directory
│   ├── utils/
│   │   └── sendEmail.js
│   ├── .env                  # Environment variables (create from .env.example)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── EmailForm.jsx
│   │   │   └── DownloadPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                  # Environment variables (create from .env.example)
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email service)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd File_share
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/file-share
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Gmail SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Configuration
MAX_FILE_SIZE=10485760
FILE_EXPIRY_HOURS=24
```

**Note:** For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833):
1. Enable 2-Factor Authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this password in `EMAIL_PASS`

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📖 API Endpoints

### Upload File
```http
POST /api/files/upload
Content-Type: multipart/form-data

Body:
- file: File (required)
- expiryHours: Number (optional, default: 24)

Response:
{
  "success": true,
  "file": {
    "id": "uuid",
    "filename": "example.pdf",
    "downloadLink": "http://localhost:5000/api/files/download/uuid",
    "expiresAt": "2026-03-07T12:00:00.000Z"
  }
}
```

### Send Email
```http
POST /api/files/send-email
Content-Type: application/json

Body:
{
  "fileId": "uuid",
  "senderEmail": "sender@example.com",
  "receiverEmail": "receiver@example.com",
  "message": "Optional message"
}

Response:
{
  "success": true,
  "message": "Email sent successfully"
}
```

### Download File
```http
GET /api/files/download/:id

Response:
- File download or error message
```

## 🎯 Usage

1. **Upload a File**
   - Open the application in your browser
   - Click "Choose File" or drag & drop
   - Optionally set expiry time
   - Click "Upload"

2. **Share the Link**
   - Copy the generated download link
   - Share directly OR send via email

3. **Send via Email**
   - Enter sender and receiver email addresses
   - Add an optional message
   - Click "Send Email"

4. **Download**
   - Recipient opens the link
   - File downloads automatically

## 🔧 Configuration

### File Size Limit
Edit `MAX_FILE_SIZE` in `.env` (in bytes):
- Default: 10MB (10485760 bytes)
- For 50MB: 52428800

### File Expiry
Edit `FILE_EXPIRY_HOURS` in `.env`:
- Default: 24 hours
- Set to 0 for no expiry

### Storage Options

#### Local Storage (Default)
Files are stored in `backend/uploads/` directory.

#### Cloudinary (Optional)
1. Install: `npm install cloudinary`
2. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
USE_CLOUDINARY=true
```

#### AWS S3 (Optional)
1. Install: `npm install aws-sdk`
2. Add to `.env`:
```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1
USE_S3=true
```

## 🔒 Security Features

- UUID-based unique links
- File expiry mechanism
- File size validation
- CORS configuration
- Error handling and validation

## 🐛 Troubleshooting

### Email not sending
- Verify Gmail account has 2FA enabled
- Use App Password, not regular password
- Check firewall/antivirus settings

### MongoDB connection error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- For MongoDB Atlas, whitelist your IP

### File upload fails
- Check file size limits
- Verify `uploads/` directory exists
- Check disk space

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Your Name

---

**Made with ❤️ using React, Node.js, and MongoDB**
 │ Generate UUID link
 ▼
Database (MongoDB)
 │
 │ store file metadata
 ▼
Return Download Link
 │
 ▼
User shares link OR sends email
 │
 ▼
Receiver opens link
 │
 ▼
Download File