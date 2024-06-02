import multer from 'multer';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Set the destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original filename
  }
});

// Create multer instance
const upload = multer({ storage: storage });

// Middleware function to handle file upload
const uploadMiddleware = upload.single('file');

export default uploadMiddleware;
