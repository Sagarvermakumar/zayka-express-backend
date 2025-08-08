// middlewares/avatarUpload.js

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ✅ Cloudinary storage for avatar only
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "profilePics",
    allowed_formats: ["jpg", "jpeg", "png","webp"],
    public_id: `avatar-${req.user?._id}-${Date.now()}`,
  }),
});

// File filter only for images (avatar)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png","image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, Webp, and PNG files are allowed."));
  }
};

//  Final multer instance
const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter,
});

export { avatarUpload };
