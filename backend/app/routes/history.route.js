const express = require("express");
const history = require("../controllers/history.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

// Tất cả routes yêu cầu đăng nhập
router.use(auth);

// Lấy lịch sử
router.get("/", history.getHistory);

// Thêm/cập nhật lịch sử
router.post("/", history.addHistory);

// Xóa một lịch sử
router.delete("/:storyId", history.removeHistory);

// Xóa toàn bộ lịch sử
router.delete("/", history.clearHistory);

module.exports = router;
