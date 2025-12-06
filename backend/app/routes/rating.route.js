const express = require("express");
const ratings = require("../controllers/rating.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes (không cần auth - mọi người có thể xem)
router.get("/story/:storyId", ratings.getRatingsByStory);
router.get("/stats/:storyId", ratings.getRatingStats);

// User routes (cần auth)
router.post("/", auth, ratings.addOrUpdateRating);
router.get("/user/:storyId", auth, ratings.getUserRating);
router.delete("/:storyId", auth, ratings.deleteRating);

// Admin routes
router.get("/admin/all", auth, isAdmin, ratings.getAllRatings);
router.delete("/admin/:ratingId", auth, isAdmin, ratings.deleteRatingById);

module.exports = router;
