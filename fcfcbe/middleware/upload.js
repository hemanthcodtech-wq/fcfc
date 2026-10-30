const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET_NAME || 'fcfc';

// Gallery — images only
const galleryStorage = multerS3({
  s3,
  bucket: BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    cb(null, `fcfc/gallery/gallery_${Date.now()}.${ext}`);
  },
});

// Presentations — video or PDF
const presentationStorage = multerS3({
  s3,
  bucket: BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const ext = (file.originalname.split('.').pop() || 'bin').toLowerCase();
    cb(null, `fcfc/presentations/pres_${Date.now()}.${ext}`);
  },
});

const galleryUpload = multer({ storage: galleryStorage });
const presentationUpload = multer({ storage: presentationStorage });

module.exports = { s3, galleryUpload, presentationUpload };
