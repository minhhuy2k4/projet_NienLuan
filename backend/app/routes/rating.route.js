const express = require("express");
const ratings = require("../controllers/rating.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// User routes (cần auth)
router.post("/", auth, ratings.addOrUpdateRating);
router.get("/user/:storyId", auth, ratings.getUserRating);
router.get("/story/:storyId", auth, ratings.getRatingsByStory);
router.get("/stats/:storyId", auth, ratings.getRatingStats);
router.delete("/:storyId", auth, ratings.deleteRating);

// Admin routes
router.get("/admin/all", auth, isAdmin, ratings.getAllRatings);
router.delete("/admin/:ratingId", auth, isAdmin, ratings.deleteRatingById);

module.exports = router;
