const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo thư mục nếu chưa tồn tại
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Cấu hình storage cho ảnh bìa truyện
const coverImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const storyId = req.params.storyId || req.body.storyId;
    const uploadPath = path.join(__dirname, "../../public/audio", storyId);
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Luôn đặt tên file là cover với extension gốc
    const extension = path.extname(file.originalname);
    cb(null, `cover${extension}`);
  },
});

// Cấu hình storage cho audio chương
const chapterAudioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const storyId = req.params.storyId || req.body.storyId;
    const uploadPath = path.join(
      __dirname,
      "../../public/audio",
      storyId,
      "chapters"
    );
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const chapterNumber = req.params.chapterNumber || req.body.chapterNumber;
    const extension = path.extname(file.originalname);
    cb(null, `${chapterNumber}${extension}`);
  },
});

// Cấu hình storage cho avatar
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/avatars");
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const userId = req.user.id; // Lấy từ auth middleware
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${userId}_${timestamp}${extension}`);
  },
});

// Cấu hình storage cho banner
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/banners");
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `banner_${timestamp}${extension}`);
  },
});

// Cấu hình storage cho ad
const adStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/ads");
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `ad_${timestamp}${extension}`);
  },
});

// File filter cho ảnh
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extension && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)"), false);
  }
};

// File filter cho audio
const audioFilter = (req, file, cb) => {
  const allowedTypes = /mp3|wav|m4a|aac|ogg/;
  const extension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = /audio/.test(file.mimetype);

  if (extension && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file audio (mp3, wav, m4a, aac, ogg)"), false);
  }
};

// Middleware upload ảnh bìa
const uploadCoverImage = multer({
  storage: coverImageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("coverImage");

// Middleware upload audio chương
const uploadChapterAudio = multer({
  storage: chapterAudioStorage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
}).single("chapterAudio");

// Middleware upload avatar
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single("avatar");

// Middleware upload banner
const uploadBanner = multer({
  storage: bannerStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("banner");

// Middleware upload ad
const uploadAd = multer({
  storage: adStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("ad");

// Hàm tạo URL cho file - Trả về relative path
const getFileUrl = (req, storyId, fileName) => {
  return `/audio/${storyId}/${fileName}`;
};

const getChapterAudioUrl = (req, storyId, chapterNumber) => {
  return `/audio/${storyId}/chapters/${chapterNumber}.mp3`;
};

// Hàm tạo URL cho banner - Trả về relative path
const getBannerImageUrl = (req, filename) => {
  return `/banners/${filename}`;
};

// Hàm tạo URL cho ad - Trả về relative path
const getAdImageUrl = (req, filename) => {
  return `/ads/${filename}`;
};

// Hàm xóa thư mục story và tất cả files
const deleteStoryFiles = (storyId) => {
  try {
    const storyPath = path.join(__dirname, "../../public/audio", storyId);
    if (fs.existsSync(storyPath)) {
      fs.rmSync(storyPath, { recursive: true, force: true });
    }
  } catch (error) {
    throw error;
  }
};

// Hàm xóa file audio chương
const deleteChapterAudio = (storyId, chapterNumber) => {
  try {
    const audioPath = path.join(
      __dirname,
      "../../public/audio",
      storyId,
      "chapters",
      `${chapterNumber}.mp3`
    );
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
  } catch (error) {
    console.error(
      `Error deleting chapter audio ${storyId}/${chapterNumber}:`,
      error
    );
    throw error;
  }
};

// Hàm xóa file banner
const deleteBannerImage = (filename) => {
  try {
    const bannerPath = path.join(__dirname, "../../public/banners", filename);
    if (fs.existsSync(bannerPath)) {
      fs.unlinkSync(bannerPath);
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

// Hàm xóa file ad
const deleteAdImage = (filename) => {
  try {
    const adPath = path.join(__dirname, "../../public/ads", filename);
    if (fs.existsSync(adPath)) {
      fs.unlinkSync(adPath);
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

// Hàm tạo URL cho avatar
const getAvatarUrl = (req, filename) => {
  return `/avatars/${filename}`;
};

module.exports = {
  uploadCoverImage,
  uploadChapterAudio,
  uploadAvatar,
  uploadBanner,
  uploadAd,
  getFileUrl,
  getChapterAudioUrl,
  getBannerImageUrl,
  getAdImageUrl,
  getAvatarUrl,
  deleteStoryFiles,
  deleteChapterAudio,
  deleteBannerImage,
  deleteAdImage,
  ensureDirectoryExists,
};
