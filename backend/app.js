const express = require("express");
const cors = require("cors");

const authRoute = require("./app/routes/auth.route");
const storyRoute = require("./app/routes/story.route");
const chapterRoute = require("./app/routes/chapter.route");
const authorRoute = require("./app/routes/author.route");
const categoryRoute = require("./app/routes/category.route");
const userRoute = require("./app/routes/user.route");
const favoriteRoute = require("./app/routes/favorite.route");
const historyRoute = require("./app/routes/history.route");
const ratingRoute = require("./app/routes/rating.route");
const commentRoute = require("./app/routes/comment.route");
const bannerRoute = require("./app/routes/banner.route");
const adRoute = require("./app/routes/ad.route");
const statisticsRoute = require("./app/routes/statistics.route");
const websiteInfoRoute = require("./app/routes/websiteinfo.route");

const chatbotRouter = require("./app/routes/chatbot.route");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use("/public", express.static("public"));
app.use("/banners", express.static("public/banners"));
app.use("/images", express.static("public/images"));
app.use("/audio", express.static("public/audio"));
app.use("/ads", express.static("public/ads"));
app.use("/avatars", express.static("public/avatars"));

app.use("/api/auth", authRoute);
app.use("/api/stories", storyRoute);
app.use("/api/chapters", chapterRoute);
app.use("/api/authors", authorRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/users", userRoute);
app.use("/api/favorites", favoriteRoute);
app.use("/api/history", historyRoute);
app.use("/api/ratings", ratingRoute);
app.use("/api/comments", commentRoute);
app.use("/api/banners", bannerRoute);
app.use("/api/ads", adRoute);
app.use("/api/statistics", statisticsRoute);
app.use("/api/website-info", websiteInfoRoute);

app.use("/api/chatbot", chatbotRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
