const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Đảm bảo thư mục audio tồn tại
const audioDir = "./public/audio";
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Đảm bảo thư mục images tồn tại
const imagesDir = "./public/images";
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Đảm bảo thư mục banners tồn tại
const bannersDir = "./public/banners";
if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true });
}

// Đảm bảo thư mục ads tồn tại
const adsDir = "./public/ads";
if (!fs.existsSync(adsDir)) {
  fs.mkdirSync(adsDir, { recursive: true });
}

// Cấu hình lưu file audio
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/audio");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Cấu hình lưu file image
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-cover" + ext;
    cb(null, uniqueName);
  },
});

// Cấu hình lưu file banner
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/banners");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const uniqueName = "banner-" + uniqueSuffix + ext;
    cb(null, uniqueName);
  },
});

// Cấu hình lưu file ad
const adStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/ads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const uniqueName = "ad-" + uniqueSuffix + ext;
    cb(null, uniqueName);
  },
});

// Chỉ chấp nhận file audio
const audioFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file audio!"), false);
  }
};

// Chỉ chấp nhận file image
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh!"), false);
  }
};

const uploadAudio = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadBanner = multer({
  storage: bannerStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadAd = multer({
  storage: adStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { uploadAudio, uploadImage, uploadBanner, uploadAd };
