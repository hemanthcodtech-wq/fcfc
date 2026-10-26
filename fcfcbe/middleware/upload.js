const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gallery — images only
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'fcfc/gallery',
    resource_type: 'image',
    public_id: `gallery_${Date.now()}`,
  }),
});

// Presentations — video or PDF
const presentationStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';
    return {
      folder: 'fcfc/presentations',
      resource_type: isPdf ? 'auto' : 'video',
      public_id: `pres_${Date.now()}`,
    };
  },
});

const galleryUpload      = multer({ storage: galleryStorage });
const presentationUpload = multer({ storage: presentationStorage });

module.exports = { cloudinary, galleryUpload, presentationUpload };
