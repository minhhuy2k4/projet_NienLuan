const express = require("express");
const authors = require("../controllers/author.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public route
router.get("/", authors.findAll);
router.get("/:id", authors.findOne);

// Admin only routes
router.post("/", auth, isAdmin, authors.create);
router.put("/:id", auth, isAdmin, authors.update);
router.delete("/:id", auth, isAdmin, authors.delete);

module.exports = router;
