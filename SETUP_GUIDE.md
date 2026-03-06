# 🚀 Quick Setup Guide

Follow these steps to get your Secure File Share System up and running.

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env)
1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `backend/.env` and update:
   - `MONGO_URI` - Your MongoDB connection string
   - `EMAIL_USER` - Your Gmail address
   - `EMAIL_PASS` - Your Gmail App Password (see below)

**Getting Gmail App Password:**
1. Enable 2-Factor Authentication on your Google account
2. Visit: https://myaccount.google.com/apppasswords
3. Generate a new app password for "Mail"
4. Copy this 16-character password to `EMAIL_PASS`

### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```
(Default values should work for local development)

## Step 3: Setup MongoDB

### Option 1: Local MongoDB
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- Use default connection: `mongodb://localhost:27017/file-share`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string and update `MONGO_URI` in `.env`

## Step 4: Run the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

## Step 5: Test the Application

1. Open http://localhost:5173 in your browser
2. Upload a test file
3. Copy the download link or send it via email
4. Test the download functionality

## 🎉 You're All Set!

Your Secure File Share System is now running!

## Common Issues

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGO_URI` format in `.env`
- For Atlas: Whitelist your IP address

### Email Not Sending
- Verify Gmail 2FA is enabled
- Use App Password, not regular password
- Check for typos in `EMAIL_USER` and `EMAIL_PASS`

### File Upload Fails
- Check file size (default limit: 10MB)
- Ensure `backend/uploads/` directory exists
- Check disk space

## Production Deployment

See the [README.md](README.md) for:
- Cloud storage options (Cloudinary, AWS S3)
- Deployment guides
- Security best practices
- Performance optimization

---

**Need Help?** Check the full [README.md](README.md) for detailed documentation.
