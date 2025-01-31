import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'boma_reviews', // Store files in 'boma_reviews' folder
    public_id: `${Date.now()}-${file.originalname}`, // Generate unique file names
    resource_type: 'auto', // Automatically detect file type
    // format: 'png', // Convert to PNG (Optional: Remove if not needed)
  }),
});

const upload = multer({ storage });

export default upload;
