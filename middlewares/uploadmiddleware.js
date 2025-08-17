const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'food-images',
    allowed_formats: ['jpg','jpeg','png']
  }
});

module.exports = multer({ storage });
