/**
 * Media Utilities - Xử lý đường dẫn hình ảnh và audio
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Lấy đường dẫn đầy đủ cho hình ảnh
 * @param {string} imagePath - Đường dẫn từ database (có thể là absolute hoặc relative)
 * @returns {string} - URL đầy đủ của hình ảnh
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // Nếu đã là URL đầy đủ (http/https), trả về luôn
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Nếu bắt đầu bằng /public, loại bỏ /public
  if (imagePath.startsWith("/public/")) {
    return `${API_URL}${imagePath.replace("/public", "")}`;
  }

  // Nếu là đường dẫn tương đối (bắt đầu bằng /)
  if (imagePath.startsWith("/")) {
    return `${API_URL}${imagePath}`;
  }

  // Nếu không có /, thêm / vào đầu
  return `${API_URL}/${imagePath}`;
};

/**
 * Lấy đường dẫn đầy đủ cho audio
 * @param {string} audioPath - Đường dẫn từ database (có thể là absolute hoặc relative)
 * @returns {string} - URL đầy đủ của audio
 */
export const getAudioUrl = (audioPath) => {
  if (!audioPath) return "";

  // Nếu đã là URL đầy đủ (http/https), trả về luôn
  if (audioPath.startsWith("http://") || audioPath.startsWith("https://")) {
    return audioPath;
  }

  // Nếu bắt đầu bằng /public, loại bỏ /public
  if (audioPath.startsWith("/public/")) {
    return `${API_URL}${audioPath.replace("/public", "")}`;
  }

  // Nếu là đường dẫn tương đối (bắt đầu bằng /)
  if (audioPath.startsWith("/")) {
    return `${API_URL}${audioPath}`;
  }

  // Nếu không có /, thêm / vào đầu
  return `${API_URL}/${audioPath}`;
};

/**
 * Lấy đường dẫn banner
 */
export const getBannerUrl = (bannerPath) => getImageUrl(bannerPath);

/**
 * Lấy đường dẫn quảng cáo
 */
export const getAdUrl = (adPath) => getImageUrl(adPath);

/**
 * Lấy đường dẫn hình ảnh truyện
 */
export const getStoryImageUrl = (imagePath) => getImageUrl(imagePath);
