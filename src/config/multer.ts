import multer from "multer";
import path from "path";
import fs from "fs";

const isProduction = process.env.NODE_ENV === "production";

// Configure storage based on environment
let storage: multer.StorageEngine;

if (isProduction) {
  // Use memory storage on Vercel (read-only filesystem)
  // NOTE: For production file uploads, migrate to Cloudinary/S3/Vercel Blob
  storage = multer.memoryStorage();
} else {
  // Use disk storage for local development
  const uploadDir = path.join(process.cwd(), "uploads", "avatars");
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (err) {
    console.error("Could not create upload directory:", err);
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename: random-timestamp.extension
      const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      cb(null, `${randomStr}-${timestamp}${ext}`);
    },
  });
}

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
  }
};

// Create multer instance
export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
