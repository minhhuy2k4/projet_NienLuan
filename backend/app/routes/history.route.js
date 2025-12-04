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

// Xóa toàn bộ lịch sử (phải đặt trước /:storyId)
router.delete("/clear", history.clearHistory);

// Xóa một lịch sử
router.delete("/:storyId", history.removeHistory);

module.exports = router;
