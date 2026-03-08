require("dotenv").config();
const mongoose = require("mongoose");
const File = require("./models/File.js");
const connectDB = require("./config/db.js");
const { v4: uuidv4 } = require("uuid");

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data (optional)
    console.log("🗑️  Clearing existing file data...");
    await File.deleteMany({});

    // Sample data for seeding
    const sampleFiles = [
      {
        filename: "sample-document-1.pdf",
        originalName: "Important Document.pdf",
        path: "/uploads/sample-document-1.pdf",
        cloudinaryId: null,
        isCloudinary: false,
        size: 2048576,
        mimetype: "application/pdf",
        uuid: uuidv4(),
        downloadCount: 5,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        filename: "sample-image-1.jpg",
        originalName: "Vacation Photo.jpg",
        path: "/uploads/sample-image-1.jpg",
        cloudinaryId: null,
        isCloudinary: false,
        size: 5242880,
        mimetype: "image/jpeg",
        uuid: uuidv4(),
        downloadCount: 2,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        filename: "sample-video-1.mp4",
        originalName: "Tutorial Video.mp4",
        path: "/uploads/sample-video-1.mp4",
        cloudinaryId: "sample_cloudinary_id_1",
        isCloudinary: true,
        size: 104857600,
        mimetype: "video/mp4",
        uuid: uuidv4(),
        downloadCount: 12,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        filename: "sample-document-2.docx",
        originalName: "Project Proposal.docx",
        path: "/uploads/sample-document-2.docx",
        cloudinaryId: null,
        isCloudinary: false,
        size: 1048576,
        mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uuid: uuidv4(),
        downloadCount: 8,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
      {
        filename: "sample-archive.zip",
        originalName: "Project Files.zip",
        path: "/uploads/sample-archive.zip",
        cloudinaryId: null,
        isCloudinary: false,
        size: 52428800,
        mimetype: "application/zip",
        uuid: uuidv4(),
        downloadCount: 3,
        expiresAt: null, // Never expires
      },
    ];

    // Insert sample files
    console.log("📁 Seeding files...");
    const insertedFiles = await File.insertMany(sampleFiles);
    console.log(`✅ ${insertedFiles.length} files seeded successfully`);

    // Display seeded data
    console.log("\n📊 Seeded Files:");
    console.log("================");
    insertedFiles.forEach((file, index) => {
      console.log(`
${index + 1}. ${file.originalName}
   UUID: ${file.uuid}
   Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
   Downloads: ${file.downloadCount}
   Expires: ${file.expiresAt ? new Date(file.expiresAt).toLocaleDateString() : "Never"}
      `);
    });

    console.log("\n✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
