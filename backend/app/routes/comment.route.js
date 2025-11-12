const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const {
  auth,
  isAdmin,
  optionalAuth,
} = require("../middlewares/auth.middleware");

// Public routes (with optional auth to check if user liked)
router.get("/chapter/:chapterId", optionalAuth, commentController.getByChapter);

// Protected routes (require login)
router.post("/", auth, commentController.create);
router.put("/:id", auth, commentController.update);
router.delete("/:id", auth, commentController.delete);
router.post("/:id/like", auth, commentController.toggleLike);
router.post("/:id/report", auth, commentController.report);

// Admin routes
router.get("/reported", auth, isAdmin, commentController.getReported);
router.get(
  "/reports",
  auth,
  isAdmin,
  commentController.getReportedCommentsWithFilters
);
router.get("/reports/stats", auth, isAdmin, commentController.getReportStats);
router.post(
  "/reports/:reportId/review",
  auth,
  isAdmin,
  commentController.reviewReport
);
router.get("/all", auth, isAdmin, commentController.getAllComments);

module.exports = router;
